// WhereItAt.cpp : This file contains the 'main' function. Program execution begins and ends there.
//just testing vscode push

#include <iostream>
#include <map>
#include <vector>
#include <list>
#include <string>
#include <map>
#include <stdio.h>
#include <fstream>
using std::map;
using std::vector;
using std::string;
using std::list;
using std::fstream;

class Node {
public:
	vector<Node*> compartments;
	vector<string> objects;
	string name;
	Node* parent;
	bool leaf = false;
};


Node* detail(string a, string b, std::map<string, Node*>* maps);
void travel(Node* root, string, bool recurse, bool destroy);
string add(Node* parent, std::map<string, Node*>* maps, bool branch, bool cont);

int main()
{
	//add tags or counts
	//add gui
	//figure out duplicates
	//move items?
	std::cout << "Hello World!\n";
	Node* all = new Node;
	std::map<string, Node*>* items = new std::map<string, Node*>;
	all = detail("files", "", items);
	all->parent = all;

	bool running = true;

	while (running)
	{
		std::cout << "We are currently at " << all->name << std::endl;
		std::cout << "What would you like to do ? " << std::endl;
		std::cout << "1. Go back up" << std::endl;
		std::cout << "2. Go to container" << std::endl;
		if (all->leaf)
		{
			std::cout << "3. Add an object" << std::endl;
			std::cout << "4. Delete object" << std::endl;
		}
		else
		{
			std::cout << "3. Add an object branch" << std::endl;
			std::cout << "4. Add an container branch" << std::endl;
		}
		std::cout << "5. Delete current branch and below" << std::endl;
		std::cout << "6. Print out current branch" << std::endl;
		std::cout << "7. Print out current branch and below" << std::endl;
		std::cout << "8. Search for an item" << std::endl;
		std::cout << "9. End the program" << std::endl;

		int option, track;
		string given, nodeName, fileName ,line;
		Node* temp;
		std::cin >> option;

		fstream data, temper;
		switch (option)
		{
		case 1:
			all = all->parent;
			break;
		case 2:
			std::cin.ignore(INT_MAX, '\n');
			getline(std::cin, given);
			for (int i = 0; i < all->compartments.size(); i++)
				if (all->compartments[i]->name.substr(0, all->compartments[i]->name.find(",")) == given)
					all = all->compartments[i];
			break;
		case 3:
			if (!all->leaf)
			{
			temp = new Node;
			temp->parent = all;
			temp->leaf = true;
			temp->name = add(all, items, true, false) + ", " + all->name;
			all->compartments.push_back(temp);
				break;
			}
			all->objects.push_back(add(all, items, false, false));
			break;
		case 4:
			if (!all->leaf)
			{
				temp = new Node;
				temp->parent = all;
				temp->leaf = false;
				temp->name = add(all, items, true, true) + ", " + all->name;
				all->compartments.push_back(temp);
				break;
			}
			std::cin.ignore(INT_MAX, '\n');
			getline(std::cin, given);
			temp = items->find(given)->second;
			items->erase(given);
			fileName = "data/" + temp->name.substr(0, temp->name.find(",")) + ".txt";
			data.open(fileName, std::ios::out | std::ios::in);
			temper.open("data/temp.txt", std::ios::out);
			track = 0;
			while (getline(data, line))
			{
				if (line != given)
				{
					temper << line << std::endl;
					continue;
				}
				track;
			}
			temp->objects.erase(temp->objects.begin()+track);
			temper.close();
			data.close();
			remove(fileName.c_str());
			rename("data/temp.txt", fileName.c_str());
			break;
		case 5:
			travel(all, "", true, true);
			break;
		case 6:
			travel(all, "", false, false);
			break;
		case 7:
			travel(all, "", true, false);
			break;
		case 8:
			std::cin.ignore(INT_MAX, '\n');
			getline(std::cin, given);
			all = items->find(given)->second;
			std::cout << all->name << std::endl;
			break;
		case 9:
			running = false;
			break;
		}
	}

	travel(all, "", false, true);
	delete items;

}

void travel(Node* root, string b, bool recurse, bool destroy) {
	std::cout << root->name << std::endl;
	bool check = true;
	if (root->leaf)
		for (vector <string>::iterator it = root->objects.begin(); it != root->objects.end(); it++)
			std::cout << b << it->c_str() << std::endl;

	else
		for (int i = 0; i < root->compartments.size(); i++)
		{
			if (destroy)
			{
				if (!recurse)
				{
					if (!root->compartments[i]->leaf)
					{
					travel(root->compartments[i], b + ".", false, true);
					delete(root->compartments[i]);
					}
					continue;
				}
				if (!root->compartments[i]->leaf)
				{
					travel(root->compartments[i], b + ".", true, true);
				}

				string file = "data/" + root->compartments[i]->name.substr(0, root->compartments[i]->name.find(",")) + ".txt";
				const char* send = file.c_str();
				if (remove(send) != 0)
					std::cout << file << std::endl;
				delete(root->compartments[i]);
			}
			else if (recurse)
				travel(root->compartments[i], b + ".", true, false);
			else
				std::cout << root->compartments[i]->name << std::endl;
		}

	if (destroy && recurse)
	{
		root->compartments.clear();
		fstream data;
		data.open("data/" + root->name.substr(0, root->name.find(",")) + ".txt", std::ios::out | std::ios::in | std::ios_base::trunc);
		data << "containers";
		data.close();
	}
	return;
}

Node* detail(string a, string b, std::map<string, Node*>* maps) {
	Node* curr = new Node;
	fstream data;
	data.open("data/" + a + ".txt", std::ios::out | std::ios::in);
	string line;
	list<string> objs;
	string typer;
	curr->name = a + b;
	std::getline(data, typer);
	if (typer == "parts")
		curr->leaf = true;

	if (!data)
		std::cout << "File not created";
	else
	{
		std::cout << "File created successfully\n";
		if (data.is_open())
			while (std::getline(data, line))
			{
				objs.push_back(line);
				//std::cout << line << std::endl;
				maps->emplace(line, curr);
			}
	}
	data.close();
	list<string>::iterator it;
	//std::cout << curr->name << std::endl;
	for (it = objs.begin(); it != objs.end(); it++)
	{
		if (curr->leaf)
			curr->objects.push_back(it->c_str());
		else
		{
			curr->compartments.push_back(detail(it->c_str(), ", " + curr->name, maps));
			curr->compartments.back()->parent = curr;
		}
	}
	return curr;
}

string add(Node* parent, std::map<string, Node*>* maps, bool branch, bool cont)
{
	string given;
	std::cin.ignore(INT_MAX, '\n');
	getline(std::cin, given);
	fstream data;
	data.open("data/" + parent->name.substr(0, parent->name.find(",")) + ".txt", std::ios::out | std::ios::in | std::ios_base::app);
	data << "\n" << given;
	data.close();
	maps->emplace(given, parent);
	if (branch)
	{
		data.open("data/" + given + ".txt", std::ios::out | std::ios::in | std::ios_base::app);
		if (cont)
			data << "containers";
		else
			data << "parts";
		data.close();
	}

	return given;
}