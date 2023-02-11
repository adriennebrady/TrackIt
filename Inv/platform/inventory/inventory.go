package inventory

type Getter interface {
	GetAll() map[string]*InvItem
}
type Poster interface {
	Add(invItem *InvItem)
	Rename(itemName string, newName string)
	Relocate(itemName string, newLocation string)
}
type Deleter interface {
	Delete(name string)
}
type InvItem struct {
	Name     string `json:"Name"`
	Location string `json:"Location"`
}

type Container struct {
	Name       string `json:"Cont Name"`
	InvItems   map[string]*InvItem
	Containers map[string]Container
}

func New() *Container {
	return &Container{
		InvItems: map[string]*InvItem{}, ///////////maybe add container initialization
	}
}

func (r *Container) Add(invItem *InvItem) {
	_, ok := r.InvItems[invItem.Name]
	if !ok {
		r.InvItems[invItem.Name] = invItem
	}
}

func (r *Container) GetAll() map[string]*InvItem {
	return r.InvItems
}

func (r *Container) Rename(itemName string, newName string) {
	_, ok := r.InvItems[itemName]
	if ok {
		checker := r.InvItems[itemName]
		r.InvItems[newName] = checker
		delete(r.InvItems, itemName)
		r.InvItems[newName].Name = newName //////////////////////////check if this deletes and ruins everything

	}
}

func (r *Container) Relocate(itemName string, newLocation string) {
	_, ok := r.InvItems[itemName]
	if ok {
		r.InvItems[itemName].Location = newLocation
	}
}

func (r *Container) Delete(name string) {
	_, ok := r.InvItems[name]
	if ok {
		delete(r.InvItems, name)
	}
}
