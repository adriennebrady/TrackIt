package inventory

type Getter interface {
	GetAll() []InvItem
}
type Adder interface {
	Add(invItem InvItem)
}

type InvItem struct {
	Name     string `json:"Item Name"`
	Location string `json:"Location"`
}

type Container struct {
	Name       string `json:"Cont Name"`
	InvItems   []InvItem
	Containers []Container
}

func New() *Container {
	return &Container{
		InvItems: []InvItem{},
	}
}

func (r *Container) Add(invItem InvItem) {
	r.InvItems = append(r.InvItems, invItem)
}

func (r *Container) GetAll() []InvItem {
	return r.InvItems
}
