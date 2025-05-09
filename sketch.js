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

// 假設 hand.keypoints 是一個包含 21 個點的陣列，每個點有 x, y 屬性
// hands 是一個陣列，包含左右手 hand 物件

function drawHandLines(hand) {
  const groups = [
    [0, 1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, 16],
    [17, 18, 19, 20]
  ];

  for (let group of groups) {
    for (let i = 0; i < group.length - 1; i++) {
      let p1 = hand.keypoints[group[i]];
      let p2 = hand.keypoints[group[i + 1]];
      line(p1.x, p1.y, p2.x, p2.y);
    }
  }
}

function draw() {
  background(220);
  image(video, 0, 0);

  // Ensure at least one hand is detected
  if (hands.length > 0) {
    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        // Loop through keypoints and draw circles
        for (let i = 0; i < hand.keypoints.length; i++) {
          let keypoint = hand.keypoints[i];

          // Color-code based on left or right hand
          if (hand.handedness == "Left") {
            fill(255, 0, 255);
          } else {
            fill(255, 255, 0);
          }

          noStroke();
          circle(keypoint.x, keypoint.y, 16);
        }
        drawHandLines(hand);
      }
    }
  }
}
