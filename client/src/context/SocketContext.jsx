import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';
import { HiWrench, HiClipboardList, HiSpeakerphone } from 'react-icons/hi';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const socketRef = useRef(null);
  // Expose a counter that components can watch to know "something changed"
  const [jobUpdate, setJobUpdate] = useState(null);

  useEffect(() => {
    if (!user) return;

    const socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000', {
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      socket.emit('join', user._id);
      if (user.role === 'technician') {
        socket.emit('join:technicians');
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    // ── Job accepted (fires for homeowner) ──────────────────────────────────
    socket.on('job:accepted', ({ jobId, technician, message }) => {
      toast.success(message, { 
        duration: 5000, 
        icon: <HiWrench className="w-5 h-5 text-brand-500" /> 
      });
      // Broadcast state change so JobDetail/JobList re-fetch
      setJobUpdate({ type: 'job:accepted', jobId, timestamp: Date.now() });
    });

    // ── Job status changed (fires for homeowner) ────────────────────────────
    socket.on('job:statusUpdate', ({ jobId, status, message }) => {
      toast(message, { 
        duration: 5000, 
        icon: <HiClipboardList className="w-5 h-5 text-blue-500" /> 
      });
      setJobUpdate({ type: 'job:statusUpdate', jobId, status, timestamp: Date.now() });
    });

    // ── New job posted (fires for all technicians) ──────────────────────────
    socket.on('job:new', ({ job }) => {
      if (user.role === 'technician') {
        toast('A new job was posted in your area!', { 
          duration: 4000,
          icon: <HiSpeakerphone className="w-5 h-5 text-amber-500" />
        });
        setJobUpdate({ type: 'job:new', jobId: job?._id, timestamp: Date.now() });
      }
    });

    // ── Job edited by homeowner ─────────────────────────────────────────────
    socket.on('job:updated', ({ jobId }) => {
      setJobUpdate({ type: 'job:updated', jobId, timestamp: Date.now() });
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, jobUpdate }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
