
export interface DifficultySettings {
    level: number;
    speedMultiplier: number;
    spawnInterval: number;
}

export class ScoreManager {

    private elapsedTime = 0;

    private distance = 0;

    private score = 0;

    private bestScore = 0;

    constructor() {
        this.loadBestScore();
    }

    private loadBestScore(): void {
        try {
            const savedScore = localStorage.getItem(
                'reckless-driving-best-score'
            );

            this.bestScore = savedScore
                ? Number(savedScore) || 0
                : 0;

        } catch {
            this.bestScore = 0;
        }
    }

    update(delta: number): void {

        this.elapsedTime += delta / 1000;

        // Virtual distance: 25 distance units per second
        this.distance = Math.floor(
            this.elapsedTime * 25
        );

        // Score is based on survival distance
        this.score = this.distance;

        // Update in-memory best score
        this.bestScore = Math.max(
            this.bestScore,
            this.score
        );
    }

    getDifficulty(): DifficultySettings {

        const level = Math.floor(
            this.distance / 500
        ) + 1;

        const speedMultiplier = Math.min(
            1 + (level - 1) * 0.12,
            2.2
        );

        const spawnInterval = Math.max(
            1200 - (level - 1) * 100,
            450
        );

        return {
            level,
            speedMultiplier,
            spawnInterval
        };
    }

    getScore(): number {
        return this.score;
    }

    getDistance(): number {
        return this.distance;
    }

    getBestScore(): number {
        return this.bestScore;
    }

    getElapsedTime(): number {
        return this.elapsedTime;
    }

    saveBestScore(): void {

        try {
            if (this.score > this.bestScore) {
                this.bestScore = this.score;
            }

            localStorage.setItem(
                'reckless-driving-best-score',
                String(this.bestScore)
            );

        } catch (error) {
            console.warn('Unable to save high score:', error);
        }
    }

}
