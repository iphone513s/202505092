// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];

function preload() {
  // Initialize HandPose model with flipped video input
  handPose = ml5.handPose({ flipped: true });
}

function mousePressed() {
  console.log(hands);
}

function gotHands(results) {
  hands = results;
}

function setup() {
  createCanvas(640, 480); // 產生一個畫布
  video = createCapture(VIDEO, { flipped: true });
  video.hide();

  // Start detecting hands
  handPose.detectStart(video, gotHands);
}

// 假設 hands 是一個陣列，包含左右手的 hand 物件
// hand.keypoints 是一個長度為 21 的陣列，每個元素有 x, y 屬性

function drawHandLines(hand) {
  // 每根手指的 keypoints 編號
  const fingerGroups = [
    [0, 1, 2, 3, 4],      // 大拇指
    [5, 6, 7, 8],         // 食指
    [9, 10, 11, 12],      // 中指
    [13, 14, 15, 16],     // 無名指
    [17, 18, 19, 20]      // 小指
  ];

  for (let group of fingerGroups) {
    for (let i = 0; i < group.length - 1; i++) {
      const kp1 = hand.keypoints[group[i]];
      const kp2 = hand.keypoints[group[i + 1]];
      if (kp1 && kp2) {
        line(kp1.x, kp1.y, kp2.x, kp2.y);
      }
    }
  }
}

function draw() {
  background(220);
  image(video, 0, 0);

  // hands 需由手部偵測模型取得
  if (typeof hands !== 'undefined') {
    for (let hand of hands) {
      drawHandLines(hand);
    }
  }
}

/* 
  The following code block was removed because it was Python code 
  and not valid in a JavaScript (p5.js/ml5.js) environment.
  Please implement any additional logic using JavaScript only.
*/
