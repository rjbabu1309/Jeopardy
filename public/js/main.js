class JeopardyGameShow {
	constructor(element, options = {}) {

		//Which categories we should use (or use default is nothing provided)
		this.useCategoryIds = options.useCategoryIds || [42, 348, 14051, 428];
		/*
		   ---
		   42: Sports
		   348: technology
		   14051: movie trailer
		   428: in the news
		   ---
		*/

		//Database
		this.categories = [];
		this.clues = {};

		//State
		this.currentClue = null;
		this.score = 0;
		this.time = 0;
		this.disableAction = false;

		//Elements
		this.boardElement = element.querySelector(".board");
		this.scoreCountElement = element.querySelector(".score-count");
		this.formElement = element.querySelector("form");
		this.inputElement = element.querySelector("input[name=user-answer]");
		this.modalElement = element.querySelector(".card-modal");
		this.clueTextElement = element.querySelector(".clue-text");
		this.resultElement = element.querySelector(".result");
		this.resultTextElement = element.querySelector(".result_correct-answer-text");
		this.successTextElement = element.querySelector(".result_success");
		this.failTextElement = element.querySelector(".result_fail");

		eventEmitter.subscribe('GAME_START', (data) => {
			this.disableAction = data.active === true ? true : false;
			console.log("1****", this.disableAction, data);

		});
	}

	initGame() {
		//Bind event handlers
		this.boardElement.addEventListener("click", event => {
			if (event.target.dataset.clueId) {
				this.handleClueClick(event);
			}
		});
		this.formElement.addEventListener("submit", event => {
			this.handleFormSubmit(event);
		});

		//Render initial state of score
		this.updateScore(0);

		//Kick off the category fetch
		this.fetchCategories();

	}
	//  startTimmer(){
	//     this.time = 5;

	//     const interval = setInterval(() => {
	//        this.timeElement.textContent = this.time;
	//        this.time--;
	//        if(this.time <0){
	//           clearInterval(interval);
	//        }
	//     }, 1000);
	//  }

	fetchCategories() {
		//Fetch all of the data from the API
		const categories = this.useCategoryIds.map(category_id => {
			return new Promise((resolve, reject) => {
				fetch(`https://jservice.io/api/category?id=${category_id}`)
					.then(response => response.json()).then(data => {
						resolve(data);
					});
			});
		});

		//Sift through the data when all categories come back
		Promise.all(categories).then(results => {

			//Build up our list of categories
			results.forEach((result, categoryIndex) => {

				//Start with a blank category
				var category = {
					title: result.title,
					clues: []
				}

				//Add every clue within a category to our database of clues
				var clues = shuffle(result.clues).splice(0, 5).forEach((clue, index) => {
					//  console.log(clue)

					//Create unique ID for this clue
					var clueId = categoryIndex + "-" + index;
					category.clues.push(clueId);

					//Add clue to DB
					this.clues[clueId] = {
						question: clue.question,
						answer: clue.answer,
						value: (index + 1) * 100
					};
				})

				//Add this category to our DB of categories
				this.categories.push(category);
			});

			//Render each category to the DOM
			this.categories.forEach((c) => {
				this.renderCategory(c);
			});
		});
	}

	renderCategory(category) {
		let column = document.createElement("div");
		column.classList.add("column");
		column.innerHTML = (
			`<header>${category.title}</header>
          <ul>
          </ul>`
		).trim();

		var ul = column.querySelector("ul");
		category.clues.forEach(clueId => {
			var clue = this.clues[clueId];
			ul.innerHTML += `<li><button data-clue-id=${clueId}>${clue.value}</button></li>`
		})

		//Add to DOM
		this.boardElement.appendChild(column);
	}

	updateScore(change) {
		this.score += change;
		this.scoreCountElement.textContent = this.score;
	}

	handleClueClick = (event) => {
		// console.log("2****", this.disableAction);

		if (!this.disableAction) {
			alert("It's not your turn.");
			return false;
		}
		var clue = this.clues[event.target.dataset.clueId];

		//Mark this button as used
		event.target.classList.add("used");

		//Clear out the input field
		this.inputElement.value = "";

		//Update current clue
		this.currentClue = clue;

		//Update the text
		this.clueTextElement.textContent = this.currentClue.question;
		this.resultTextElement.textContent = this.currentClue.answer;

		//Hide the result
		this.modalElement.classList.remove("showing-result");

		//Show the modal
		this.modalElement.classList.add("visible");
		this.inputElement.focus();
	}

	//Handle an answer from user
	handleFormSubmit(event) {
		event.preventDefault();

		var isCorrect = this.cleanseAnswer(this.inputElement.value) === this.cleanseAnswer(this.currentClue.answer);
		if (isCorrect) {
			this.updateScore(this.currentClue.value);
		}

		//Show answer
		this.revealAnswer(isCorrect);
	}

	//Standardize an answer string so we can compare and accept variations
	cleanseAnswer(input = "") {
		var friendlyAnswer = input.toLowerCase();
		friendlyAnswer = friendlyAnswer.replace("<i>", "");
		friendlyAnswer = friendlyAnswer.replace("</i>", "");
		friendlyAnswer = friendlyAnswer.replace(/ /g, "");
		friendlyAnswer = friendlyAnswer.replace(/"/g, "");
		friendlyAnswer = friendlyAnswer.replace(/^a /, "");
		friendlyAnswer = friendlyAnswer.replace(/^an /, "");
		return friendlyAnswer.trim();
	}


	revealAnswer(isCorrect) {

		//Show the individual success/fail case
		this.successTextElement.style.display = isCorrect ? "block" : "none";
		this.failTextElement.style.display = !isCorrect ? "block" : "none";

		//Show the whole result container
		this.modalElement.classList.add("showing-result");

		//Disappear after a short bit
		setTimeout(() => {
			this.modalElement.classList.remove("visible");
		}, 3000);
	}

}




function shuffle(a) {
	var j, x, i;
	for (i = a.length - 1; i > 0; i--) {
		j = Math.floor(Math.random() * (i + 1));
		x = a[i];
		a[i] = a[j];
		a[j] = x;
	}
	return a;
} 

//-------------------------------------------
// const app = document.querySelector(".app");
const app = document.getElementById("app");

const game = new JeopardyGameShow(app, {});
game.initGame();
