package resolvers

import (
	"fmt"

	models "github.com/proxima-one/proxima-data-vertex/pkg/models"
	proxima "github.com/proxima-one/proxima-db-client-go/pkg/database"
)

func GenerateProof(rawProof *proxima.ProximaDBProof) models.Proof {
	proof := string(rawProof.GetProof())
	root := fmt.Sprintf("%x\n", rawProof.GetRoot())
	return models.Proof{Proof: &proof, Root: &root}
}
