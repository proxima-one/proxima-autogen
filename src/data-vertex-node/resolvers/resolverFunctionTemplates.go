// func (r *dPoolResolver) $EntityNames(ctx context.Context, obj *models.DPool) ([]*models.User, error) {
	//determine which set of ids to get
	entities, _ := dataloader.For(ctx).$loaderName.LoadAll(obj.$input)
	var args map[string]interface{} = graphql.GetFieldContext(ctx).Args
	//check argument context
	//context check the args, where, orderBy, orderDirection, first, last, prove
	//getDefaults/getTheContextArgs
	//from identifier,
	//use to get from context
	results, err := proximaIterables.Search(entities, args["where"], args["orderBy"], args["direction"].(bool), args["first"].(int), args["last"].(int), "")
	if err != nil {
		return make([]*models.$OutputEntity, 0), nil
	}
	return results.([]*models.$OutputEntity), nil
//}
####
// func (r *queryResolver) $EntityNames(ctx context.Context, where *string, orderBy *string, direction *bool, first *int, last *int, limit *int, prove *bool) ([]*models.$EntityName, error) {
		args := DefaultInputs
		if prove != nil {
			args["prove"] = *prove
		}
		if limit != nil {
			args["limit"] = *limit
		}
		if first != nil {
			args["first"] = *first
		}
		if last != nil {
			args["last"] = *last
		}
		if asc != nil {
			args["direction"] = *asc
		}
		if orderBy != nil {
			args["order_by"] = *orderBy
		}
		if where != nil {
			args["where"] = *where
		}
		table, _ := r.db.GetTable("DPoolLists")
		result, err := table.Search(args["where"].(string), args["order_by"].(string), args["direction"].(bool), args["first"].(int), args["last"].(int), args["prove"].(bool), args)
		if err != nil {
		return nil, err
		}
	value := make([]*models.$EntityName, 0)
	for _, dataRow := range result {
		var val models.$EntityName
		err = json.Unmarshal(dataRow.GetValue(), &val)
		if err != nil {
			return nil, err
		}
		p := GenerateProof(dataRow.GetProof())
		val.Proof = &p
		value = append(value, &val)
	}
	return value, nil
//}
####
//func (r *queryResolver) DPoolList(ctx context.Context, id string, prove *bool) (*models.DPoolList, error) {
	args := DefaultInputs
	if prove != nil {
		args["prove"] = *prove
	}
	args["id"] = id
	table, _ := r.db.GetTable("$EntityNames")
	result, err := table.Get(id, args["prove"].(bool))
	if err != nil {
		return nil, err
	}
	data := result.GetValue()
	var val models.$EntityName
	err = json.Unmarshal(data, &val)
	if err != nil {
		return nil, err
	}
	p := GenerateProof(result.GetProof())
	val.Proof = &p

	return &val, nil
//}
####
args := DefaultInputs
if prove != nil {
	args["prove"] = *prove
}
table, _ := r.db.GetTable("$EntityNames")
result, err := table.Query(queryText, args["prove"].(bool))
if err != nil {
	return nil, err
}
value := make([]*models.$EntityName, 0)
for _, dataRow := range result {
	var val models.$EntityName
	err = json.Unmarshal(dataRow.GetValue(), &val)
	if err != nil {
		return nil, err
	}
	p := GenerateProof(dataRow.GetProof())
	val.Proof = &p
	value = append(value, &val)
}
return value, nil
####
args := DefaultInputs
table, _ := r.db.GetTable("$EntityNames")
_, err := table.Put(*input.ID, input, args["prove"].(bool), args)
boolResult := true
if err != nil {
	boolResult = false
}
return &boolResult, err
