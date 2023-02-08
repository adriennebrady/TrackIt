package inventory

type Getter interface {
	GetAll() map[string]InvItem
}
type Adder interface {
	Add(invItem InvItem)
}
type Renamer interface {
	Rename(invItem InvItem, newName string)
}
type Relocater interface {
	Relocate(invItem InvItem, newLocation string)
}

type InvItem struct {
	Name     string `json:"Name"`
	Location string `json:"Location"`
}

type Container struct {
	Name       string `json:"Cont Name"`
	InvItems   map[string]InvItem
	Containers map[string]Container
}

func New() *Container {
	return &Container{
		InvItems: map[string]InvItem{}, ///////////maybe add container initialization
	}
}

func (r *Container) Add(invItem InvItem) {
	_, ok := r.InvItems[invItem.Name]
	if !ok {
		r.InvItems[invItem.Name] = invItem
	}
}

func (r *Container) GetAll() map[string]InvItem {
	return r.InvItems
}

func (r *Container) Rename(invItem InvItem, newName string) {
	_, ok := r.InvItems[invItem.Name]
	if ok {
		r.Add(InvItem{newName, invItem.Location})
		delete(r.InvItems, invItem.Name)

	}

}

func (r *Container) Relocate(invItem InvItem, newLocation string) {
	ab := invItem.Name
	_, ok := r.InvItems[invItem.Name]
	if ok {
		delete(r.InvItems, invItem.Name)
		r.Add(InvItem{ab, newLocation})
	}

}


