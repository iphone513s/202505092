// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];
let circleRadius = 50;
let circleCenter = [320, 240];
let dragging = false;

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

function isPointInCircle(point, center, radius) {
  return dist(point[0], point[1], center[0], center[1]) < radius;
}

function draw() {
  background(220);
  image(video, 0, 0);

  // 先畫圓，確保在最上層
  fill(0, 255, 0, 180); // 半透明綠色
  stroke(0);            // 黑色邊框
  strokeWeight(4);
  ellipse(circleCenter[0], circleCenter[1], circleRadius * 2);

  // hands 需由手部偵測模型取得
  if (typeof hands !== 'undefined') {
    let fingerPoints = [];
    for (let hand of hands) {
      drawHandLines(hand);
      // 取得食指指尖座標 (keypoint 8)
      const kp = hand.keypoints[8];
      if (kp) {
        fingerPoints.push([kp.x, kp.y]);
      }
    }

    // 判斷是否有兩隻手的食指都在圓內
    if (fingerPoints.length == 2) {
      if (isPointInCircle(fingerPoints[0], circleCenter, circleRadius) &&
          isPointInCircle(fingerPoints[1], circleCenter, circleRadius)) {
        // 移動圓心到兩食指的中點
        circleCenter = [
          (fingerPoints[0][0] + fingerPoints[1][0]) / 2,
          (fingerPoints[0][1] + fingerPoints[1][1]) / 2
        ];
      }
    }
  }
}
