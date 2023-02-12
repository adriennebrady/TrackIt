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
	inv := New() ////////////////////////////////////
	inv.Add(&InvItem{"ac", "de"})
	inv.Rename("ac", "newdfsdf")

	if inv.InvItems["newdfsdf"].Name != "newdfsdf" {
		t.Errorf("Item was not renamed")
	}

}

func TestRelocate(t *testing.T) {
	inv := New()
	inv.Add(&InvItem{"ac", "de"})
	inv.Relocate("ac", "newdfsdf")

	if inv.InvItems["ac"].Location != "newdfsdf" {
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
