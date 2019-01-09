window.onload = function() {

	var input, ul_tags, module_search;

	input = document.getElementById("js_tags");
	ul_tags = document.getElementById("js_list-tags");
	module_search = document.getElementsByClassName("tag-module__search")[0];
	module_select = document.getElementsByClassName("tag-module__select")[0];

	function clearInput(object) {
		object.value = '';
		return;
	}

	function clearBlock() {
		if (module_search.classList.contains("d-block")) {
			module_search.classList.remove("d-block");
			module_search.classList.add("d-none");
		}
		while (ul_tags.firstChild) {
			ul_tags.removeChild(ul_tags.firstChild);
		}
	}

	function searchTags(tags) {
		clearBlock();
		getTags(tags);
	}

	function shieldingRegExp(str, flags) {
		var result;

		result = new RegExp(str.replace(/(\[|\\|\^|\$|\||\?|\*|\+|\(|\)|\.)/g, '\\$1'), flags);
		return (result);
	}

	function checkExisting(tag)
	{
		//Проверка на существующий тег
		return (0);
	}

	function checkTag(tag)
	{
		return (tag);
	}

	function addTag(tag)
	{
		tag = checkTag(tag);
		if (!checkExisting(tag))
		{
			li = document.createElement("li");
			a = document.createElement("a");
			div = document.createElement("div");
			div.classList.add("tag-module__remove");
			a.setAttribute("href", "javascript:void(0);");

			a.innerHTML = tag;
			module_select.append(li);
			li.append(a);
			li.append(div);
			clearInput(input);
		}
	}

	// Makes str bold
	function getBoldTag(tag, index, count)
	{
		var c, str;

		c = 0;
		str = [];
		while (count--)
			str[c++] = tag[index++];
		str = str.join("");
		return (tag.replace(new RegExp(`(${str})`, ''), '<b>$1</b>'));
	}

	function ll()
	{
		alert(1123);
	}

	// Prints tags in the search box
	function enterTags(tag, index, count)
	{
		var div, li, a;

		if (module_search.classList.contains("d-none")) {
			module_search.classList.remove("d-none");
			module_search.classList.add("d-block");
		}
		li = document.createElement("li");
		a = document.createElement("a");
		a.setAttribute("href", "javascript:void(0);");
		a.innerHTML = getBoldTag(tag, index, count);
		ul_tags.append(li);
		li.append(a);
	}

	// Extract json file and send results
	function getTags(tag) {
		var c, request, tags_json, tags_arr, index;

		tags_arr = [];
		request = new XMLHttpRequest();
		request.open('GET', 'base_tags.json');
		request.onreadystatechange = function(e) {
			if (this.readyState == 4)
				if (this.status == 200)
				{
					tags_json = JSON.parse(this.responseText);
					for (c in tags_json) {
						index = tags_json[c].search(shieldingRegExp(tag, 'gi'));
						if (index != -1)
							if (find(tags_arr, tags_json[c]) != -1)
								enterTags(tags_json[c], index, tag.length);
					}
				}
		}
		request.send();
	}

	// Prohibit writing spaces
	input.addEventListener("keydown", function() {
		if (this.value.search(/\s/g, "") != -1)
			this.value = this.value.replace(/\s/g, "");
		// this.style.width = ((this.value.length + 1) * 8) + 'px';
	});

	// Events that catch, keystrokes, focus
	input.addEventListener("keyup", function(k) {
		this.value = this.value.trim();
		if (k.keyCode == 13 || k.keyCode == 32) {
			if (this.value)
				addTag(this.value);
			else
				clearInput(this);
		}
		if (this.value && this.value != '#')
			searchTags(this.value);
		else
			clearBlock();
	});
}