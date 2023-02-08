package inventory

type Getter interface {
	GetAll() map[string]*InvItem
}
type Adder interface {
	Add(invItem *InvItem)
}
type Renamer interface {
	Rename(invItem *InvItem, newName string)
}
type Relocater interface {
	Relocate(invItem *InvItem, newLocation string)
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

func (r *Container) Rename(invItem *InvItem, newName string) {
	_, ok := r.InvItems[invItem.Name]
	if ok {
		r.InvItems[newName] = invItem
		delete(r.InvItems, invItem.Name)
		r.InvItems[newName].Name = newName //////////////////////////check if this deletes and ruins everything

	}

}

<<<<<<< HEAD
func (r *Container) Relocate(invItem InvItem, newLocation string) {
	ab := invItem.Name
	_, ok := r.InvItems[invItem.Name]
	if ok {
		delete(r.InvItems, invItem.Name)
		r.Add(InvItem{ab, newLocation})
	}
=======
func (r *Container) Relocate(invItem *InvItem, newLocation string) {
	_, ok := r.InvItems[invItem.Name]
	if ok {
		r.InvItems[invItem.Name].Location = newLocation
>>>>>>> 3633c480fb87736b730805e786a80be45c88b236

	}
}

func (r *Container) Delete(name string) {
	_, ok := r.InvItems[name]
	if ok {
		delete(r.InvItems, name)
	}
}
