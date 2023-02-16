package inventory

type Getter interface {
	GetAll() map[string]*InvItem
}
type Poster interface {
	Add(invItem *InvItem)
	Rename(itemName string, newName string)
	Relocate(itemName string, newLocation string)
	AddContainer(invItem *InvItem)
	RenameContainer(itemName string, newName string)
	RelocateContainer(itemName string, newLocation string)
}
type Deleter interface {
	Delete(name string)
}
type InvItem struct {
	Name     string `json:"Name"`
	Location string `json:"Location"`
}

type Container struct {
	LocID      int
	Name       string `json:"Cont Name"`
	Location   string `json:"Cont Location"`
	InvItems   map[string]*InvItem
	Containers map[string]Container
	Parent     *Container
}

//main storage for all containers
type ContainerStorage struct {
	ContainersHolder map[string]*Container
}

func New() *Container {
	return &Container{
		InvItems: map[string]*InvItem{}, ////TODO maybe add container initialization
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
		r.InvItems[newName].Name = newName ////TODO check if this deletes and ruins everything

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


func (r *ContainerStorage) AddContainer(cont *Container) { ///////////
	_, ok := r.ContainersHolder[cont.Name]
	if !ok {
		r.ContainersHolder[cont.Name] = cont
	}
}

/*func (r *Container) GetAllContainers() map[string]*Container {
	return r.Containers
}*/

func (r *ContainerStorage) RenameContainer(containerName string, newContainerName string) {
	_, ok := r.ContainersHolder[containerName]
	if ok {
		checker := r.ContainersHolder [containerName]
		r.ContainersHolder [newContainerName ] = checker
		delete(r.ContainersHolder , containerName)
		r.ContainersHolder [newContainerName].Name = newContainerName  //////////////////////////check if this deletes and ruins everything

	}
}

func (r *ContainerStorage) RelocateContainer(containerName string, newContainerLocation string) { ////////
	_, ok := r.ContainersHolder[containerName]
	if ok {
		r.ContainersHolder[containerName].Location = newContainerLocation
	}
}
