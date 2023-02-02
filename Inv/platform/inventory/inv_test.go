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
