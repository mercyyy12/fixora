package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/joho/godotenv"
	"github.com/rs/cors"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/x/mongo/driver/connstring"
)

type Stats struct {
	TotalUsers        int     `json:"totalUsers"`
	TotalHomeowners   int     `json:"totalHomeowners"`
	TotalTechnicians  int     `json:"totalTechnicians"`
	TotalActiveJobs   int     `json:"totalActiveJobs"`
	CompletedJobs     int     `json:"completedJobs"`
	PendingApprovals  int     `json:"pendingApprovals"`
	ReportsComplaints int     `json:"reportsComplaints"`
	Revenue           float64 `json:"revenue"`
}

var client *mongo.Client

func getStats(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	uri := os.Getenv("MONGO_URI")
	cs, err := connstring.ParseAndValidate(uri)
	dbName := "test"
	if err == nil && cs.Database != "" {
		dbName = cs.Database
	}
	db := client.Database(dbName)

	totalUsers, _ := db.Collection("users").CountDocuments(ctx, bson.M{})
	totalHomeowners, _ := db.Collection("users").CountDocuments(ctx, bson.M{"role": "homeowner"})
	totalTechnicians, _ := db.Collection("users").CountDocuments(ctx, bson.M{"role": "technician"})
	
	activeFilter := bson.M{"status": bson.M{"$in": []string{"Accepted", "In Progress"}}}
	totalActiveJobs, _ := db.Collection("jobs").CountDocuments(ctx, activeFilter)
	completedJobs, _ := db.Collection("jobs").CountDocuments(ctx, bson.M{"status": "Completed"})
	
	pendingApprovals, _ := db.Collection("users").CountDocuments(ctx, bson.M{"role": "technician", "isVerified": false})
	
	reportsCount, _ := db.Collection("reports").CountDocuments(ctx, bson.M{"status": "Pending"})

	// AGGREGATE REAL REVENUE from Completed jobs budget
	var revenue float64 = 1245000.0 // 100% fake data as requested

	stats := Stats{
		TotalUsers:       int(totalUsers),
		TotalHomeowners:  int(totalHomeowners),
		TotalTechnicians: int(totalTechnicians),
		TotalActiveJobs:  int(totalActiveJobs),
		CompletedJobs:    int(completedJobs),
		PendingApprovals: int(pendingApprovals),
		ReportsComplaints: int(reportsCount),
		Revenue:          revenue,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(stats)
}

func getTechnicians(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	skill := r.URL.Query().Get("skill")

	uri := os.Getenv("MONGO_URI")
	cs, err := connstring.ParseAndValidate(uri)
	dbName := "test"
	if err == nil && cs.Database != "" {
		dbName = cs.Database
	}
	db := client.Database(dbName)
	
	filter := bson.M{"role": "technician", "isBlocked": bson.M{"$ne": true}} // Respect blocking
	if skill != "" {
		filter["skills"] = bson.M{"$regex": skill, "$options": "i"}
	}

	findOptions := options.Find().SetSort(bson.D{{Key: "rating.average", Value: -1}})
	cursor, err := db.Collection("users").Find(ctx, filter, findOptions)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer cursor.Close(ctx)

	var techs []bson.M
	if err = cursor.All(ctx, &techs); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(techs)
}

func main() {
	godotenv.Load("../../.env")
	
	mongoURI := os.Getenv("MONGO_URI")
	if mongoURI == "" {
		mongoURI = "mongodb://localhost:27017/fixora"
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var err error
	client, err = mongo.Connect(ctx, options.Client().ApplyURI(mongoURI))
	if err != nil {
		log.Fatal(err)
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/api/admin/stats", getStats)
	mux.HandleFunc("/api/technicians", getTechnicians)

	handler := cors.Default().Handler(mux)

	port := os.Getenv("ANALYTICS_PORT")
	if port == "" {
		port = "6000"
	}

	log.Printf("Go Analytics Microservice running on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, handler))
}
