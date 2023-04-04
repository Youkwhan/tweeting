import { tweetsData } from "./data.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";

document.addEventListener("click", function (e) {
	if (e.target.dataset.like) {
		handleLikeClick(e.target.dataset.like);
	} else if (e.target.dataset.retweet) {
		handleRetweetClick(e.target.dataset.retweet);
	} else if (e.target.dataset.reply) {
		handleReplyClick(e.target.dataset.reply);
	} else if (e.target.id === "tweet-btn") {
		handleTweetBtnClick();
	} else if (e.target.dataset.replyBtn) {
		handleTweetReplyBtnClick(e.target.dataset.replyBtn);
	}
});

function handleLikeClick(tweetId) {
	const targetTweetObj = tweetsData.filter(function (tweet) {
		return tweet.uuid === tweetId;
	})[0];

	if (targetTweetObj.isLiked) {
		targetTweetObj.likes--;
	} else {
		targetTweetObj.likes++;
	}
	targetTweetObj.isLiked = !targetTweetObj.isLiked;
	render();
}

function handleRetweetClick(tweetId) {
	const targetTweetObj = tweetsData.filter(function (tweet) {
		return tweet.uuid === tweetId;
	})[0];

	if (targetTweetObj.isRetweeted) {
		targetTweetObj.retweets--;
	} else {
		targetTweetObj.retweets++;
	}
	targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted;
	render();
}

function handleReplyClick(replyId) {
	document.getElementById(`replies-${replyId}`).classList.toggle("hidden");
	
	// isOpen logic to keep the replies open when reload page
	const targetTweetObj = tweetsData.filter(function (tweet) {
		return tweet.uuid === replyId;
	})[0];
	// When we click to open, isOpen =false to true ... wgeb we click again to close, isOpen=true to false
	targetTweetObj.isOpen = !targetTweetObj.isOpen
}

function handleTweetBtnClick() {
	const tweetInput = document.getElementById("tweet-input");

	if (tweetInput.value) {
		addNewTweet(tweetsData, tweetInput);
	}
}

function handleTweetReplyBtnClick(tweetId) {
	const tweetInput = document.getElementById(`tweet-reply-input-${tweetId}`);

	if (tweetInput.value) {
		const targetTweetObj = tweetsData.filter(function (tweet) {
			return tweet.uuid === tweetId;
		})[0];

		addNewTweet(targetTweetObj.replies, tweetInput);
	}
}

function addNewTweet(tweetArray, tweetInput) {
	tweetArray.unshift({
		handle: `@AnonymousMe`,
		profilePic: `images/glasseslogo.jpg`,
		likes: 0,
		retweets: 0,
		tweetText: tweetInput.value,
		replies: [],
		isLiked: false,
		isRetweeted: false,
		uuid: uuidv4(),
		isOpen: false,
	});
	render();
	tweetInput.value = "";
}

function getFeedHtml() {
	let feedHtml = ``;

	tweetsData.forEach(function (tweet) {
		let likeIconClass = "";

		if (tweet.isLiked) {
			likeIconClass = "liked";
		}

		let retweetIconClass = "";

		if (tweet.isRetweeted) {
			retweetIconClass = "retweeted";
		}

		let repliesHtml = "";

		if (tweet.replies.length > 0) {
			tweet.replies.forEach(function (reply) {
				repliesHtml += `
					<div class="tweet-reply">
						<div class="tweet-inner">
							<img src="${reply.profilePic}" class="profile-pic">
									<div>
										<p class="handle">${reply.handle}</p>
										<p class="tweet-text">${reply.tweetText}</p>
									</div>
							</div>
					</div>
					`;
			});
		}

		feedHtml += `
			<div class="tweet">
				<div class="tweet-inner">
					<img src="${tweet.profilePic}" class="profile-pic">
					<div>
							<p class="handle">${tweet.handle}</p>
							<p class="tweet-text">${tweet.tweetText}</p>
							<div class="tweet-details">
								<span class="tweet-detail">
									<i class="fa-regular fa-comment-dots"
									data-reply="${tweet.uuid}"
									></i>
									${tweet.replies.length}
								</span>
								<span class="tweet-detail">
									<i class="fa-solid fa-heart ${likeIconClass}"
									data-like="${tweet.uuid}"
									></i>
									${tweet.likes}
								</span>
								<span class="tweet-detail">
									<i class="fa-solid fa-retweet ${retweetIconClass}"
									data-retweet="${tweet.uuid}"
									></i>
									${tweet.retweets}
								</span>
							</div>   
					</div>            
				</div>
				<div ${tweet.isOpen ? "" : 'class="hidden"'} id="replies-${tweet.uuid}">
					<div class="tweet-reply">
						<div class="tweet-inner">
							<img src="images/glasseslogo.jpg" class="profile-pic">
							<div>
								<p class="handle">@AnonymousMe</p>
								<textarea placeholder="Comment here" class="tweet-reply-input" id="tweet-reply-input-${
									tweet.uuid
								}"></textarea>
							</div>
							<button id="tweet-reply-btn" data-reply-btn="${tweet.uuid}">Reply</button>
						</div>
					</div>

					${repliesHtml}
				</div>   
			</div>
			`;
	});
	return feedHtml;
}

function render() {
	document.getElementById("feed").innerHTML = getFeedHtml();
}

render();
