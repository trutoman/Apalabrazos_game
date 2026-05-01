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
        this.answerRadius = Phaser.Math.Clamp(
            options.answerRadius ?? Math.round(this.roscoRadius * 0.23),
            28,
            50
        );
        this.answerTextMaxWidth = Phaser.Math.Clamp(
            options.answerTextMaxWidth ?? Math.round(this.scene.scale.width * 0.16),
            110,
            220
        );
        this.labelMap = { 1: 'A', 2: 'B', 3: 'C', 4: 'D' };

        this.positionMap = this.scene.scale.width < 1000
            ? this._buildVerticalPositionMap()
            : this._buildSidePositionMap(options);

        this._drawAll();
    }

    _buildSidePositionMap(options = {}) {
        const horizontalGapFromRosco = Phaser.Math.Clamp(
            options.horizontalGapFromRosco ?? Math.round(this.scene.scale.width * 0.08),
            30,
            130
        );
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

    _buildVerticalPositionMap() {
        // Answers placed below the rosco in two rows: [A B] / [C D]
        // Circle is on the outer side, text goes toward center
        const rowGap = this.answerRadius * 2 + 20;
        const baseY = this.centerY + this.roscoRadius + this.roscoButtonRadius + this.answerRadius + 30;
        const halfGap = this.answerRadius + 14 + this.answerTextMaxWidth / 2;
        const cx = this.centerX;

        // Left column: circles at cx - halfGap, text to the right toward center
        // Right column: circles at cx + halfGap, text to the left toward center
        const leftX  = cx - halfGap;
        const rightX = cx + halfGap;

        return {
            1: { x: leftX,  y: baseY,          textSide: 'right' }, // A top-left
            2: { x: rightX, y: baseY,          textSide: 'left'  }, // B top-right
            3: { x: leftX,  y: baseY + rowGap, textSide: 'right' }, // C bottom-left
            4: { x: rightX, y: baseY + rowGap, textSide: 'left'  }, // D bottom-right
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

        // Shadow
        this.scene.add.circle(pos.x + 4, pos.y + 4, r, 0x000000, 0.35);

        // Main circle
        const circle = this.scene.add.circle(pos.x, pos.y, r, 0x8e44ad);
        circle.setStrokeStyle(3, 0x5b2c6f);

        // Letter label
        this.scene.add.text(pos.x, pos.y, label, {
            fontSize: `${Phaser.Math.Clamp(Math.round(r * 0.64), 18, 32)}px`,
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
        const yFromRosco = this.centerY + this.roscoRadius + Math.round(this.scene.scale.height * 0.22);
        const barHeight = Phaser.Math.Clamp(Math.round(this.scene.scale.height * 0.085), 44, 64);
        const barWidth = Phaser.Math.Clamp(this.scene.scale.width - 40, 320, 900);
        const textWrapWidth = barWidth - 40;
        const barY = Math.min(this.scene.scale.height - Math.round(barHeight / 2) - 8, yFromRosco);

        // Background bar
        this.scene.add.rectangle(cx, barY, barWidth, barHeight, 0x1a1a2e, 0.75)
            .setOrigin(0.5);

        this.scene.add.text(cx, barY, this.questionText, {
            fontSize: `${Phaser.Math.Clamp(Math.round(this.scene.scale.width * 0.016), 14, 20)}px`,
            fontFamily: 'Archivo Black',
            color: '#ffffff',
            align: 'center',
            wordWrap: { width: textWrapWidth },
        }).setOrigin(0.5);
    }
}
