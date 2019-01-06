window.onload = function() {

	var input, ul_tags, block_tags;

	input = document.getElementById("tags");
	ul_tags = document.getElementById("ul_tags");
	block_tags = document.getElementsByClassName('block_tags')[0];

	function clearInput(object) {
		object.value = '';
		return;
	}

	function addTags(tags) {
		clearInput(input);
		console.log(tags);
	}

	function clearBlock() {
		if (block_tags.classList.contains("display__block")) {
			block_tags.classList.remove("display__block");
			block_tags.classList.add("display__none");
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

	function getBoldTags(tags, index, count)
	{
		var c, str;

		c = 0;
		str = [];
		while (count--)
			str[c++] = tags[index++];
		str = str.join("");
		return (tags.replace(new RegExp(`(${str})`, ''), '<b>$1</b>'));
	}

	function enterTags(tags, index, count)
	{
		var li, a;

		if (block_tags.classList.contains("display__none"))
		{
			block_tags.classList.remove("display__none");
			block_tags.classList.add("display__block");
		}
		li = document.createElement("li");
		ul_tags.append(li);
		a = document.createElement("a");
		a.setAttribute("onclick","addTags('"+ tags +"');");
		a.innerHTML = "#" + getBoldTags(tags, index, count);
		li.append(a);
	}

	function getTags(tags) {
		var request, tags_arr, tags_json, c, index;

		tags_arr = [];
		request = new XMLHttpRequest();
		request.open('GET', 'base_tags.json');
		request.onreadystatechange = function(e) {
			if (this.readyState == 4) {
				if (this.status == 200)
				{
					tags_json = JSON.parse(this.responseText);
					for (c in tags_json) {
						index = tags_json[c].search(shieldingRegExp(tags, 'gi'));
						if (index != -1)
							if (find(tags_arr, tags_json[c]) != -1)
								enterTags(tags_json[c], index, tags.length);
					}
				}
			}
		}
		request.send();
	}

	input.addEventListener("keyup", function(k) {
		if (k.keyCode == 13 || k.keyCode == 32) {
			if (input.value.trim())
				addTags(input.value.trim());
			else
				clearInput(input);
		}
		input.addEventListener("blur", function() {
			if (input.value)
			{
				addTags(input.value);
				// clearBlock();
			}
		});
		if (input.value.trim())
			searchTags(input.value.trim());
		// else
		// 	clearBlock();
	});
}