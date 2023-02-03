package inventory

import "testing"

func TestAdd(t *testing.T) {
	inv := New()
	inv.Add(InvItem{"check", "dfj"})

	if len(inv.InvItems) != 1 {
		t.Errorf("Item was not added")
	}
}

func TestGetAll(t *testing.T) {

	inv := New()
	inv.Add(InvItem{})
	results := inv.GetAll()
	if len(results) != 1 {
		t.Errorf("Item was not added")
	}

}

func TestRename(t *testing.T) {
	inv := New()
	inv.Add(InvItem{"ac", "de"})
	inv.rename(inv.InvItems[0], "newdfsdf")

	if inv.InvItems[0].Name != "newdfsdf" {
		t.Errorf("Item was not renamed")
	}
}
