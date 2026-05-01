export class Question {
    // answer1..4 = { text: string, index: 1|2|3|4 }
    // question   = string
    constructor(scene, answer1, answer2, answer3, answer4, question, options = {}) {
        this.scene = scene;
        this.answers = [answer1, answer2, answer3, answer4];
        this.questionText = question;

        this.centerX = options.centerX ?? (this.scene.scale.width / 2);
        this.centerY = options.centerY ?? (this.scene.scale.height / 2);
        this.roscoRadius = options.roscoRadius || 220;
        this.roscoButtonRadius = options.roscoButtonRadius || 22;
        this.answerRadius = 50;
        this.answerTextMaxWidth = 200;
        this.labelMap = { 1: 'A', 2: 'B', 3: 'C', 4: 'D' };

        const horizontalGapFromRosco = 130;
        const verticalOffset = Math.round(this.roscoRadius * 0.45);
        const minSidePadding = 20;
        const roscoTextSafeGap = 24;
        const gapTextToCircle = this.answerRadius + 14;
        const minLeftCircleXByViewport = minSidePadding + this.answerRadius;
        const maxRightCircleXByViewport = this.scene.scale.width - minSidePadding - this.answerRadius;

        const maxLeftCircleXByTextViewport = this.scene.scale.width - minSidePadding - this.answerTextMaxWidth - gapTextToCircle;
        const minRightCircleXByTextViewport = minSidePadding + this.answerTextMaxWidth + gapTextToCircle;

        // Keep response text outside the rosco square area at all times.
        const roscoOuterRadius = this.roscoRadius + this.roscoButtonRadius;
        const roscoLeftBound = this.centerX - roscoOuterRadius;
        const roscoRightBound = this.centerX + roscoOuterRadius;
        const maxLeftCircleXByRosco = roscoLeftBound - roscoTextSafeGap - this.answerTextMaxWidth - gapTextToCircle;
        const minRightCircleXByRosco = roscoRightBound + roscoTextSafeGap + this.answerTextMaxWidth + gapTextToCircle;

        const baseOffsetX = this.roscoRadius + this.roscoButtonRadius + this.answerRadius + horizontalGapFromRosco;
        const desiredLeftCircleX = this.centerX - baseOffsetX;
        const desiredRightCircleX = this.centerX + baseOffsetX;

        const leftMinX = minLeftCircleXByViewport;
        const leftMaxX = Math.min(maxLeftCircleXByTextViewport, maxLeftCircleXByRosco);
        const rightMinX = Math.max(minRightCircleXByTextViewport, minRightCircleXByRosco);
        const rightMaxX = maxRightCircleXByViewport;

        const leftCircleX = Math.max(leftMinX, Math.min(desiredLeftCircleX, leftMaxX));
        const rightCircleX = Math.max(rightMinX, Math.min(desiredRightCircleX, rightMaxX));

        this.positionMap = {
            1: { x: leftCircleX, y: this.centerY - verticalOffset, textSide: 'right' },
            2: { x: rightCircleX, y: this.centerY - verticalOffset, textSide: 'left'  },
            3: { x: leftCircleX, y: this.centerY + verticalOffset, textSide: 'right' },
            4: { x: rightCircleX, y: this.centerY + verticalOffset, textSide: 'left'  },
        };

        this._drawAll();
    }

    _drawAll() {
        this.answers.forEach(answer => this._drawAnswer(answer));
        this._drawQuestion();
    }

    _drawAnswer(answer) {
        const pos   = this.positionMap[answer.index];
        const label = this.labelMap[answer.index];
        const r     = this.answerRadius;

        // Shadow
        this.scene.add.circle(pos.x + 4, pos.y + 4, r, 0x000000, 0.35);

        // Main circle
        const circle = this.scene.add.circle(pos.x, pos.y, r, 0x8e44ad);
        circle.setStrokeStyle(3, 0x5b2c6f);

        // Letter label
        this.scene.add.text(pos.x, pos.y, label, {
            fontSize: '32px',
            fontFamily: 'Archivo Black',
            color: '#ffffff',
        }).setOrigin(0.5);

        // Answer text beside the circle
        const gap      = r + 14;
        const textX    = pos.textSide === 'right' ? pos.x + gap : pos.x - gap;
        const originX  = pos.textSide === 'right' ? 0 : 1;

        this.scene.add.text(textX, pos.y, answer.text, {
            fontSize: '20px',
            fontFamily: 'Archivo Black',
            color: '#222222',
            wordWrap: { width: this.answerTextMaxWidth },
        }).setOrigin(originX, 0.5);
    }

    _drawQuestion() {
        const cx = this.centerX;
        const yFromRosco = this.centerY + this.roscoRadius + 170;
        const barY = Math.min(this.scene.scale.height - 52, yFromRosco);

        // Background bar
        this.scene.add.rectangle(cx, barY, 900, 60, 0x1a1a2e, 0.75)
            .setOrigin(0.5);

        this.scene.add.text(cx, barY, this.questionText, {
            fontSize: '20px',
            fontFamily: 'Archivo Black',
            color: '#ffffff',
            align: 'center',
            wordWrap: { width: 860 },
        }).setOrigin(0.5);
    }
}
