import { InteractiveButton } from './interactiveButton.js';

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
        this.answerRadius = options.answerRadius || 50;
        this.answerTextMaxWidth = options.answerTextMaxWidth || 200;
        this.labelMap = { 1: '1', 2: '2', 3: '3', 4: '4' };
        this.answerButtons = new Map();

        this.positionMap = this._buildSidePositionMap(options);

        this._drawAll();
    }

    _buildSidePositionMap(options = {}) {
        const horizontalGapFromRosco = options.horizontalGapFromRosco || 130;
        const verticalOffset = Math.round(this.roscoRadius * 0.45);
        const minSidePadding = 20;
        const roscoTextSafeGap = 24;
        const gapTextToCircle = this.answerRadius + 14;
        const minLeftCircleXByViewport = minSidePadding + this.answerRadius;
        const maxRightCircleXByViewport = this.scene.scale.width - minSidePadding - this.answerRadius;
        const maxLeftCircleXByTextViewport = this.scene.scale.width - minSidePadding - this.answerTextMaxWidth - gapTextToCircle;
        const minRightCircleXByTextViewport = minSidePadding + this.answerTextMaxWidth + gapTextToCircle;
        const roscoOuterRadius = this.roscoRadius + this.roscoButtonRadius;
        const roscoLeftBound = this.centerX - roscoOuterRadius;
        const roscoRightBound = this.centerX + roscoOuterRadius;
        const maxLeftCircleXByRosco = roscoLeftBound - roscoTextSafeGap - this.answerTextMaxWidth - gapTextToCircle;
        const minRightCircleXByRosco = roscoRightBound + roscoTextSafeGap + this.answerTextMaxWidth + gapTextToCircle;
        const baseOffsetX = this.roscoRadius + this.roscoButtonRadius + this.answerRadius + horizontalGapFromRosco;
        const leftCircleX = Math.max(minLeftCircleXByViewport, Math.min(this.centerX - baseOffsetX, Math.min(maxLeftCircleXByTextViewport, maxLeftCircleXByRosco)));
        const rightCircleX = Math.max(Math.max(minRightCircleXByTextViewport, minRightCircleXByRosco), Math.min(this.centerX + baseOffsetX, maxRightCircleXByViewport));

        return {
            1: { x: leftCircleX,  y: this.centerY - verticalOffset, textSide: 'right' },
            2: { x: rightCircleX, y: this.centerY - verticalOffset, textSide: 'left'  },
            3: { x: leftCircleX,  y: this.centerY + verticalOffset, textSide: 'right' },
            4: { x: rightCircleX, y: this.centerY + verticalOffset, textSide: 'left'  },
        };
    }

    _drawAll() {
        this.answers.forEach(answer => this._drawAnswer(answer));
        this._drawQuestion();
    }

    _drawAnswer(answer) {
        const pos   = this.positionMap[answer.index];
        const label = this.labelMap[answer.index];
        const r     = this.answerRadius;

        const button = new InteractiveButton(
            this.scene,
            `answer_${answer.index}_button`,
            pos.x,
            pos.y,
            r * 2,
            r * 2,
            label,
            null,
            {
                circleColor: 0xff00f4,
                strokeColor: 0x5b2c6f,
                strokeWidth: 3,
                textColor: '#ffffff',
                fontSize: '32px',
                shadowAlpha: 1
            }
        );
        this.answerButtons.set(answer.index, button);

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
