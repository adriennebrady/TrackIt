package inventory

import "testing"

func TestAdd(t *testing.T) {
	inv := New()
	inv.Add(&InvItem{"check", "dfj"})

	if len(inv.InvItems) != 1 {
		t.Errorf("Item was not added")
	}
}

func TestGetAll(t *testing.T) {
	inv := New()
	inv.Add(&InvItem{})
	results := inv.GetAll()
	if len(results) != 1 {
		t.Errorf("Item was not added")
	}
}

func TestRename(t *testing.T) {
	inv := New()
	inv.Add(&InvItem{"ac", "de"})
	inv.Rename("ac", "rep")

	if inv.InvItems["rep"].Name != "rep" {
		t.Errorf("Item was not renamed")
	}
}

func TestRelocate(t *testing.T) {
	inv := New()
	inv.Add(&InvItem{"ac", "de"})
	inv.Relocate("ac", "rep")

	if inv.InvItems["ac"].Location != "rep" {
		t.Errorf("Item was not relocated")
	}
}

func TestDelete(t *testing.T) {
	inv := New()
	inv.Add(&InvItem{"ac", "de"})
	if len(inv.InvItems) != 1 {
		t.Errorf("Item was not added")
	}
	inv.Delete("ac")
	if len(inv.InvItems) != 0 {
		t.Errorf("Item was not removed")
	}
}

func TestAddCont(t *testing.T) {
	inv := New()
	var newItems = map[string]*InvItem{}
	var children = map[string]*Container{}
	inv.AddContainer(&Container{1, "top drawer", "dresser", newItems, children, nil})
	inv.AddContainer(&Container{2, "bottom drawer", "dresser", newItems, children, nil})

	if len(inv.Containers) != 2 {
		t.Errorf("Item was not added")
	}
}

func TestAddCont2(t *testing.T) {
	inv := New()
	var newItems = map[string]*InvItem{}
	var children = map[string]*Container{}
	inv.AddContainer(&Container{1, "top drawer", "dresser", newItems, children, nil})
	inv = inv.Containers["top drawer"]
	inv.AddContainer(&Container{2, "bottom drawer", "dresser", newItems, children, nil})

	if inv.Name != "top drawer" {
		t.Errorf("Traverse failed")
	}

	inv = inv.Parent

	if inv.LocID != -1 {
		t.Errorf("Traverse failed")
	}
}

func TestRenameCont(t *testing.T) {
	inv := New()
	var newItems = map[string]*InvItem{}
	var children = map[string]*Container{}
	inv.AddContainer(&Container{1, "top drawer", "dresser", newItems, children, nil})
	inv.RenameContainer("top drawer", "mid drawer")

	if inv.Containers["mid drawer"].Name != "mid drawer" {
		t.Errorf("Item was not renamed")
	}
}

func TestRelocateCont(t *testing.T) {
	inv := New()
	var newItems = map[string]*InvItem{}
	var children = map[string]*Container{}
	inv.AddContainer(&Container{1, "top drawer", "dresser", newItems, children, nil})
	inv.RelocateContainer("top drawer", "fridge")

	if inv.Containers["top drawer"].Location != "fridge" {
		t.Errorf("Item was not relocated")
	}
}

func TestDeleteCont(t *testing.T) {
	inv := New()
	var newItems = map[string]*InvItem{}
	var children = map[string]*Container{}
	inv.AddContainer(&Container{1, "top drawer", "dresser", newItems, children, nil})
	inv.AddContainer(&Container{2, "bottom drawer", "dresser", newItems, children, nil})
	if len(inv.Containers) != 2 {
		t.Errorf("Item was not added")
	}
	inv.DeleteContainer("top drawer")
	if len(inv.Containers) != 1 {
		t.Errorf("Item was not removed")
	}
}
