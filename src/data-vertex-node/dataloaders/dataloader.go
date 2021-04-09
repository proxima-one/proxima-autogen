package dataloader

import (
	"context"
	"encoding/json"
	"time"

	"github.com/gin-gonic/gin"
	_ "github.com/json-iterator/go"
	"github.com/proxima-one/proxima-data-vertex/pkg/models"
	proxima "github.com/proxima-one/proxima-db-client-go/pkg/database"
)

const loadersKey = "dataloaders"

type Loaders struct {
  #######LOADERS
}

func For(ctx context.Context) *Loaders {
	return ctx.Value(loadersKey).(*Loaders)
}

func Middleware(db *proxima.ProximaDatabase) gin.HandlerFunc {
	return gin.HandlerFunc(func(c *gin.Context) {
		ctx := context.WithValue(c.Request.Context(), loadersKey, &Loaders{
          ########NEW DATALOADERS
		})
		c.Request.WithContext(ctx)
		c.Next()
	})
}

//get dataloader
//fetch function

//entity  basics

//by id

//batch
