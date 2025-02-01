package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

// Define request structure
type RequestBody struct {
	Model  string `json:"model"`
	Prompt string `json:"prompt"`
	Stream bool   `json:"stream"`
}

// Define response structure
type ResponseBody struct {
	Response string `json:"response"`
}

// Function to call Mistral 7B (Ollama API)
func callMistral(prompt string) string {
	url := "http://localhost:11434/api/generate"

	reqBody := RequestBody{
		Model:  "mistral",
		Prompt: prompt,
		Stream: false,
	}

	jsonData, _ := json.Marshal(reqBody)
	resp, err := http.Post(url, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		fmt.Println("Error:", err)
		return "Error connecting to AI model"
	}
	defer resp.Body.Close()

	body, _ := ioutil.ReadAll(resp.Body)

	var response ResponseBody
	json.Unmarshal(body, &response)

	return response.Response
}

// API handler
func aiHandler(w http.ResponseWriter, r *http.Request) {
	// Read user input
	var input struct {
		Prompt string `json:"prompt"`
	}

	err := json.NewDecoder(r.Body).Decode(&input)
	if err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	// Get AI response
	aiResponse := callMistral(input.Prompt)

	// Send response
	json.NewEncoder(w).Encode(map[string]string{"response": aiResponse})
}

func main() {
	// Create a new router
	router := mux.NewRouter()

	// Define API routes
	router.HandleFunc("/api/ask", aiHandler).Methods("POST")

	// Start the server
	fmt.Println("Server is running on port 8080...")
	log.Fatal(http.ListenAndServe(":8080", router))
}
