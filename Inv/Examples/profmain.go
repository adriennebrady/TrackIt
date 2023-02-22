package example

import (
	"log"
	"net/http"
)

func min() {

	host := "127.0.0.1:8081"
	if err := http.ListenAndServe(host, httpHandler()); err != nil {
		log.Fatalf("Failed to listen on %s: %v", host, err)
	}

}
