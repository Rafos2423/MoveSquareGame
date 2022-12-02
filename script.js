var offset;
var sizecell;
var colCells;
var colFreeCells;
var shuffle;

var tiles = [];
var freeCells = [];

colMovements = -2;

function create() {
	
	var cell = $("<div></div>");
	$(cell).addClass("field__cell");
	$("#field").append(cell);
	
	return cell;
}

function createSquare(i) {
	
	var border = $("<div></div");
	$(border).attr("id", "border" + i);
	$(border).addClass("border");
	$("#menu").append(border);
	
	var square = $("<div></div");
	$(square).attr("id", "square" + i);
	$(square).addClass("square");
	$("#border" + i).append(square);
	
	var sizes = [236, 175, 142, 117, 104];
	var randElement = Math.floor(Math.random() * sizes.length);
	var size = Math.floor(sizes[randElement] / 2);
	var num = [Math.floor(Math.random() * (randElement + 3)**2)];
	
	$("#border" + i).css({
		width:  size + 2 * (9 - randElement) + "px", 
		height: size + 2 * (9 - randElement) + "px",
		borderRadius:  (9 - randElement) / 2 + "px",		
	});
	
	$("#square" + i).css({
		width:  size + "px", 
		height: size + "px", 
		left: (9 - randElement) + "px",
		top: (9 - randElement) + "px",
		borderRadius:  (9 - randElement) / 2 + "px",
	});
	
	function settingsTile() {
		$("#square" + i).html(num);
		$("#square" + i).css({
		fontSize: 10 * (9 - randElement) / 2 + "px", 
		backgroundColor: '#381945'});
	}
	
	if (num == 0) {
		$("#square" + i).css({backgroundColor: '#77438a'});
		$("#square" + i).on('click', function () {
			while (num == 0)
				num = [Math.floor(Math.random() * (randElement + 3)**2)];
			
			settingsTile();
		});
	}
	
	else
		settingsTile();
}

function createTitle() {
	
	var title = $("<div></div>");
	$(title).attr('id', "title");
	$("#menu").append(title);
	$(title).html("ПЯТНАШКИ");
	$(title).css({left: (window.innerWidth - document.getElementById("title").offsetWidth) / 2 + 'px'});
}

function createOptions() {
	
	var options = $("<div></div>");
	$(options).attr('id', "options");
	$("#menu").append(options);
	
	for (var i = 0; i < 3; i++) {
		
		var blockOpt = $("<div></div>");
		$(blockOpt).addClass("menu--opt");
		$(options).append(blockOpt);
	
		var textOpt = $("<div></div>");
		$(textOpt).addClass("menu--text");
		$(textOpt).attr('id', "text" + i);
		$(blockOpt).append(textOpt);
	
		var valueOpt = $("<select></select>");
		$(valueOpt).addClass("menu--value");
		$(valueOpt).attr('id', "value" + i);
		$(blockOpt).append(valueOpt);
	}
	
	$("#text0").html("Размер игрового поля");
	$("#text1").html("Количество пустых ячеек");
	$("#text2").html("Сложность игры");
	
	for (var i = 3; i <= 7; i++) {
		
		var option = $("<option></option>");
		$(option).attr('id', "option1" + i);
		$("#value0").append(option);
		$(option).html(i + "x" + i);
	}
	
	for (var i = 1; i < 5; i++) {
		
		var option = $("<option></option>");
		$(option).attr('id', "option2" + i);
		$("#value1").append(option);
		$(option).val(i);
		$(option).html(i);
	}
	
	for (var i = 1; i < 4; i++) {
		
		var option = $("<option></option>");
		$(option).attr('id', "option3" + i);
		$("#value2").append(option);
		$(option).html(i);
	}
	
	$("#value0").prop("selectedIndex", 1);
	$("#value2").prop("selectedIndex", 1);
	$(options).css({left: (window.innerWidth - document.getElementById("options").offsetWidth) / 2 + 'px'})
}

function createButton() {
	
	var button = $("<div></div>");
	$(button).attr('id', "button");
	$("#menu").append(button);
	$(button).html("Играть");
	$(button).css({left: (window.innerWidth - document.getElementById("button").offsetWidth) / 2 + 'px'})
	
	$(button).on("click", function() {
		
		colCells = document.getElementById("value0").options.selectedIndex + 3;
		colFreeCells = document.getElementById("value1").options.selectedIndex + 1;
		shuffle = document.getElementById("value2").options.selectedIndex + 1;
		
		$("#menu").remove();
		$("#message").remove();
		
		createField();
		createCells();
		createTiles();
		createModal();
		
		shuffleTiles();	
		timer();
	});
}

function createMessage() {
	
	var messageArea = $("<div></div>");
	$(messageArea).attr('id', "messageArea");
	$("#menu").append(messageArea);
	$(messageArea).html("!");

	var message = $("<div></div>");
	$(message).attr('id', "message");
	$(messageArea).append(message);
	$(message).html("Если выбрано более 2 свободных ячеек, то левая кнопка мыши: движение по горизонтали правая кнопка мыши: движение по вертикали");
	$(messageArea).css({left: (window.innerWidth - document.getElementById("messageArea").offsetWidth) / 2 + 'px'})
	
}

function createMenu() {
	
	var menu = $("<div></div>");
	$(menu).attr('id', "menu");
	$("body").append(menu);
	
	createTitle();
	createOptions();
	createButton();
	createMessage();
	
	flySquares();
}

function createModal() {

	var modal = $("<div></div");
	$(modal).addClass("modal");
	$("#field").append(modal);
}

function createField() {
	
	if (colCells == 3) {
		offset = 23;
		sizecell = 236;
	}
	else if (colCells == 4) {
		offset = 20;
		sizecell = 175;
	}
	else if (colCells == 5) {
		offset = 15;
		sizecell = 142;
	}
	else if (colCells == 6) {
		offset = 14;
		sizecell = 117;
	}
	else if (colCells == 7) {
		offset = 9;
		sizecell = 104;
	}
	
	var field = $("<div></div>");
	$(field).attr('id', "field");
	$("body").append(field);
	
	var movements = $("<div></div>");
	$(movements).attr('id', "movements");
	$("body").append(movements);
	
	var escape = $("<div></div>");
	$(escape).attr('id', "escape");
	$("body").append(escape);
	$(escape).html("Главное меню");
	
	var time = $("<div></div>");
	$(time).attr('id', "time");
	$("body").append(time);
}

function createCells() {
	
	for (var y = 0; y < colCells; y++) {
	
		for(var x = 0; x < colCells; x++) {
			
			var cell = create();
			$(cell).addClass("field__cell--null");
			
			$(cell).css({
			width: sizecell + "px", 
			height: sizecell + "px",
			borderRadius: (10 - colCells) + "px"
			});			
			
			cell.x = x;
			cell.y = y;
			setOffset(cell);
		}
	}
}

function createTiles() {
	
	var countFreeCells = 0;
	
	for (var y = 0; y < colCells; y++) {
	
		for (var x = 0; x < colCells; x++) {
		
			var tile = create();				
			
			tile.x = x;
			tile.y = y;
			tile.num = colCells * y + x;
			
			setOffset(tile);		
			tiles[tile.num] = tile;
			
			if (tile.num < colFreeCells) {
				freeCells[countFreeCells] = tile;
				countFreeCells++;
				continue;
			}
			
			else {
				$(tile).html(tile.num - countFreeCells + 1);	
				$(tile).addClass("field__cell--tile");
				
				$(tile).css({
				width: sizecell + "px", 
				height: sizecell + "px", 
				fontSize: 10 * (10 - colCells) + "px",
				borderRadius: (10 - colCells) + "px",
				//border-width: 
				});					
				
				if (colFreeCells == 1)
					animateTilesFirst(tile);
				else 
					animateTilesSecond(tile);
			}			
		}
	}
}

function setOffset(cell) {
	
	$(cell).css({left: offset + (offset + sizecell) * cell.x});
	$(cell).css({top: offset + (offset + sizecell) * cell.y});
	$(cell).css({transition: 'all 0.3s ease-in-out 0s'});
}

function setOffsetSquare(i, randomSide) {
	
	var squareHeight = document.getElementById("border" + i).offsetHeight;
	var squareWidth =  document.getElementById("border" + i).offsetWidth;
	var parentHeight = window.innerHeight;
	var parentWidth  = window.innerWidth;
	
	var heightRandom = Math.random() * (parentHeight - squareHeight - 200) + 100;
	var  widthRandom = Math.random() * (parentWidth  - squareWidth  - 200) + 100;
	
	if (randomSide == 0) {
		$("#border" + i).css({left: -squareWidth, top: heightRandom});
	}

	else if (randomSide == 1) {
		$("#border" + i).css({left: parentWidth, top: heightRandom});
	}

	else if (randomSide == 2) {
		$("#border" + i).css({left: widthRandom, top: -squareHeight});
	}

	else if (randomSide == 3) {
		$("#border" + i).css({left: widthRandom, top: parentHeight});
	}
}

function shuffleTiles() {
	
	if (colFreeCells == 1) {
		for (var i = 0; i < Math.pow(colCells, shuffle); i++) {
			tiles[Math.floor(Math.random() * (tiles.length))].click();
			colMovements = -2;
		}
	}
	else {
		for (var i = 0; i < Math.pow(colCells, shuffle)/2; i++) {
			$(tiles[Math.floor(Math.random() * (tiles.length))]).trigger({type: 'mousedown', which: 1});
			$(tiles[Math.floor(Math.random() * (tiles.length))]).trigger({type: 'mousedown', which: 3});
			colMovements = -2;
		}
	}
	
	if (checkVictory())
		shuffleTiles();
	
	colMovements = 0;
	$("#movements").html("Ходы: " + colMovements);
}

function moveSquare(i) {
	
	var randomSide = Math.floor(Math.random() * 4);	
	setOffsetSquare(i, randomSide);

	var lastRandomSide = randomSide;
	while (lastRandomSide == randomSide)
		randomSide = Math.floor(Math.random() * 4);

	setOffsetSquare(i, randomSide);

	var randomDurationTime = Math.random() * 5 + 1.5;
	var randomDelayTime = Math.random() * 2;
	
	var angles = [-270, -180, -90, 90, 180, 270];
	var randomRotate = angles[Math.floor(Math.random() * angles.length)];
	
	$("#border" + i).css({
		transitionDuration: randomDurationTime + 's',
		transitionDelay: randomDelayTime + 's' });	
	$("#border" + i).css('transform', 'rotate('+randomRotate+'deg)');
	
	function deleteSquare() {
		$('#border' + i).remove();
	}
	setTimeout(deleteSquare, (randomDurationTime + randomDelayTime) * 1000);
}

function flySquares() {
	
	var colSquares = 0;
	createSquare(colSquares);
	moveSquare(colSquares);
	
	$("#button").on("click", function() { 
		clearInterval(colSquares_timer_id) });

	colSquares_timer_id = setInterval(function() {
		
		colSquares++;
		createSquare(colSquares);
		moveSquare(colSquares);
		
	}, 2000);
}

function findFreeCellX(tile, position) {
	
	var optFreeCell = -2;

	for (var i = tile.num; i >= tile.y * colCells && i < (tile.y + 1) * colCells; i += position) {
		
		if (!$(tiles[i]).hasClass("field__cell--tile"))
			optFreeCell = i;
		
		if (optFreeCell == i - position)
			return optFreeCell;
	}
	
	return optFreeCell;
}

function findFreeCellY(tile, position) {
	
	var optFreeCell = -colCells - 1;
	
	var i = tile.num;
	for (; i >= tile.x && i <= tile.x + colCells * (colCells - 1); i += colCells * position) {
		
		if (!$(tiles[i]).hasClass("field__cell--tile"))
			optFreeCell = i;
		
		if (optFreeCell == i - colCells * position) 
			return optFreeCell;
	}
	
	return optFreeCell;
}

function findFirstCellTileX(tile, position) {
	
	for (var i = tile.num; i >= tile.y * colCells && i < (tile.y + 1) * colCells; i += position) {
		
		if (!$(tiles[i]).hasClass("field__cell--tile"))
			return i - position;					
	}
}

function findFirstCellTileY(tile, position) {
	
	for (var i = tile.num; i >= tile.x && i <= tile.x + colCells * (colCells - 1); i += colCells * position) {
		
		if (!$(tiles[i]).hasClass("field__cell--tile"))
			return i - colCells * position;				
	}
}

function movementX(i, optFreeCell, firstCellTile) {
	
	tiles[optFreeCell + i] = [tiles[firstCellTile + i], tiles[firstCellTile + i] = tiles[optFreeCell + i]][0];
	tiles[optFreeCell + i].x = [tiles[firstCellTile + i].x, tiles[firstCellTile + i].x = tiles[optFreeCell + i].x][0];
	
	tiles[optFreeCell + i].num = colCells * tiles[optFreeCell + i].y + tiles[optFreeCell + i].x;
	tiles[firstCellTile + i].num = colCells * tiles[firstCellTile + i].y + tiles[firstCellTile + i].x;
	
	setOffset(tiles[optFreeCell + i]);
}

function movementY(i, optFreeCell, firstCellTile) {
	
	tiles[optFreeCell + i * colCells] = [tiles[firstCellTile + i * colCells], tiles[firstCellTile + i * colCells] = tiles[optFreeCell + i * colCells]][0];
	tiles[optFreeCell + i * colCells].y = [tiles[firstCellTile + i * colCells].y, tiles[firstCellTile + i * colCells].y = tiles[optFreeCell + i * colCells].y][0];
	
	tiles[optFreeCell + i * colCells].num = colCells * tiles[optFreeCell + i * colCells].y + tiles[optFreeCell + i * colCells].x;
	tiles[firstCellTile + i * colCells].num = colCells * tiles[firstCellTile + i * colCells].y + tiles[firstCellTile + i * colCells].x;
	
	setOffset(tiles[optFreeCell + i * colCells]);
}

function animateTilesFirst(tile) {
	
	$(tile).on("click", function tileClick() {
			
			if (findFreeCellX(tile, -1) != -2) {
				
				var optFreeCell = findFreeCellX(tile, -1);
				var firstCellTile = findFirstCellTileX(tile, -1);
				var differents = tile.num - firstCellTile;
				
				for (var i = 0; i < differents + 1; i++) {				
					movementX(i, optFreeCell, firstCellTile)
				}				
				colMovements++;
			}
			
			else if (findFreeCellX(tile, 1) != -2) {
				
				var optFreeCell = findFreeCellX(tile, 1);				
				var firstCellTile = findFirstCellTileX(tile, 1);
				var differents = tile.num - firstCellTile;
				
				for (var i = 0; i > differents - 1; i--) {				
					movementX(i, optFreeCell, firstCellTile)
				}
				colMovements++;	
			}
			
			else if (findFreeCellY(tile, 1) != -colCells - 1) {
				
				var optFreeCell = findFreeCellY(tile, 1);				
				var firstCellTile = findFirstCellTileY(tile, 1);
				var differents = (tile.num - firstCellTile)/colCells;
				
				for (var i = 0; i > differents - 1; i--) {				
					movementY(i, optFreeCell, firstCellTile)
				}
				colMovements++;
			}	
			
			else if (findFreeCellY(tile, -1) != -colCells - 1) {
				
				var optFreeCell = findFreeCellY(tile, -1);
				var firstCellTile = findFirstCellTileY(tile, -1);
				var differents = (tile.num - firstCellTile)/colCells;
				
				for (var i = 0; i < differents + 1; i++) {				
					movementY(i, optFreeCell, firstCellTile)
				}
				colMovements++;
			}
			
			$("#movements").html("Ходы: " + colMovements);
	});
}

function animateTilesSecond(tile) {
	
	$(tile).on("mousedown", function(event) {
		
		if (event.which == 1 && findFreeCellX(tile, -1) != -2) {
				
				var optFreeCell = findFreeCellX(tile, -1);
				var firstCellTile = findFirstCellTileX(tile, -1);
				var differents = tile.num - firstCellTile;
				
				for (var i = 0; i < differents + 1; i++) {				
					movementX(i, optFreeCell, firstCellTile)
				}				
				colMovements++;
		}
		
		else if (event.which == 1 && findFreeCellX(tile, 1) != -2) {
				
				var optFreeCell = findFreeCellX(tile, 1);				
				var firstCellTile = findFirstCellTileX(tile, 1);
				var differents = tile.num - firstCellTile;
				
				for (var i = 0; i > differents - 1; i--) {				
					movementX(i, optFreeCell, firstCellTile)
				}
				colMovements++;	
		}
		
		if (event.which == 3 && findFreeCellY(tile, 1) != -colCells -1) {
			
				var optFreeCell = findFreeCellY(tile, 1);				
				var firstCellTile = findFirstCellTileY(tile, 1);
				var differents = (tile.num - firstCellTile)/colCells;
				
				for (var i = 0; i > differents - 1; i--) {				
					movementY(i, optFreeCell, firstCellTile)
				}
				colMovements++;
		}	
		
		else if (event.which == 3 && findFreeCellY(tile, -1) != -colCells - 1) {		
				
				var optFreeCell = findFreeCellY(tile, -1);
				var firstCellTile = findFirstCellTileY(tile, -1);
				var differents = (tile.num - firstCellTile)/colCells;
				
				for (var i = 0; i < differents + 1; i++) {				
					movementY(i, optFreeCell, firstCellTile)
				}
				colMovements++;
		}
		
		$("#movements").html("Ходы: " + colMovements);
		
		if (colMovements > 0 && checkVictory()) {
			$("#modal").html("Победа!");
			$("#modal").attr("id","modal--visible");
		}
	});
}

function checkVictory() {
	
	var countFreeCell = 0;
	
	for (var i = 0; i < tiles.length - 1; i++) {	
		
		if (!$(tiles[i]).hasClass("field__cell--tile")) {
			countFreeCell++;
			continue;
		}
		
		if (i != $(tiles[i]).text() - 1 + countFreeCell) 		
			return false;
	}
	return true;
}

function timer() {
	
	var minutes = 0;
	var seconds = 0;
	
	$("#time").html("Время: " + minutes + ":0" + seconds);
	
	$("#escape").on("click", function() {
		
		clearInterval(seconds_timer_id);
		
		$("#field").remove();
		$("#movements").remove();
		$("#escape").remove();
		$("#time").remove();
		tiles = [];

		createMenu();
	});
	
	var seconds_timer_id = setInterval(function() {
		
		seconds++;
		
		if (seconds == 60) {
			minutes++;
			seconds = 0;
		}
		
		if (seconds < 10)
			$("#time").html("Время: " + minutes + ":0" + seconds);
		else 
			$("#time").html("Время: " + minutes + ":" + seconds);
		
		if (minutes == 10) {
			clearInterval(seconds_timer_id);
			$(".modal").html("Время вышло");
			$(".modal").addClass("modal--visible");
		}
		
		else if (colMovements >= 1000) {
			clearInterval(seconds_timer_id);
			$(".modal").html("Ходы закончились");
			$(".modal").addClass("modal--visible");
		}
		
		else if (colMovements > 0 && checkVictory()) {
			clearInterval(seconds_timer_id);
			$(".modal").html("Победа!");
			$(".modal").addClass("modal--visible");
		}
		
	}, 1000);
}

createMenu();