var percentile40DataPoints = [
    { x: 12, y: 4.0 },
    { x: 16, y: 4.4 },
    { x: 20, y: 4.7 },
    { x: 24, y: 4.9 },
    { x: 28, y: 5.5 },
    { x: 32, y: 6.3 },
    { x: 36, y: 7.0 },
    { x: 40, y: 7.7 },
    { x: 44, y: 8.2 },
    { x: 48, y: 8.6 },
    { x: 52, y: 9.0 },
    { x: 56, y: 9.3 },
    { x: 60, y: 9.6 },
    { x: 64, y: 10.2 },
    { x: 68, y: 10.7 },
    { x: 72, y: 11.2 },
    { x: 76, y: 11.3 },
    { x: 80, y: 11.4 },
    { x: 84, y: 11.6 },
    { x: 88, y: 11.8 },
    { x: 92, y: 12.2 },
    { x: 96, y: 12.3 },
    { x: 100, y: 12.5 },
    { x: 104, y: 12.7 },
    { x: 108, y: 12.8 },
    { x: 112, y: 13.0 },
    { x: 116, y: 13.1 },
    { x: 120, y: 13.2 },
    { x: 124, y: 13.2 },
    { x: 128, y: 13.2 },
    { x: 132, y: 13.2 },
    { x: 136, y: 13.2 },
    { x: 140, y: 13.2 },
    { x: 144, y: 13.2 },
    { x: 148, y: 13.2 }
];

var percentile75DataPoints = [
    { x: 12, y: 5.0 },
    { x: 16, y: 5.5 },
    { x: 20, y: 5.9 },
    { x: 24, y: 6.1 },
    { x: 28, y: 7.0 },
    { x: 32, y: 8.0 },
    { x: 36, y: 8.9 },
    { x: 40, y: 9.9 },
    { x: 44, y: 10.3 },
    { x: 48, y: 10.8 },
    { x: 52, y: 11.3 },
    { x: 56, y: 12.0 },
    { x: 60, y: 12.6 },
    { x: 64, y: 12.9 },
    { x: 68, y: 13.1 },
    { x: 72, y: 13.4 },
    { x: 76, y: 13.8 },
    { x: 80, y: 14.3 },
    { x: 84, y: 14.7 },
    { x: 88, y: 14.7 },
    { x: 92, y: 15.0 },
    { x: 96, y: 15.2 },
    { x: 100, y: 15.3 },
    { x: 104, y: 15.4 },
    { x: 108, y: 15.5 },
    { x: 112, y: 15.6 },
    { x: 116, y: 15.7 },
    { x: 120, y: 15.8 },
    { x: 124, y: 15.7 },
    { x: 128, y: 15.6 },
    { x: 132, y: 15.5 },
    { x: 136, y: 15.4 },
    { x: 140, y: 15.3 },
    { x: 144, y: 15.2 },
    { x: 148, y: 15.3}
];

var percentile95DataPoints = [
    { x: 12, y: 7.0 },
    { x: 16, y: 7.2 },
    { x: 20, y: 7.4 },
    { x: 24, y: 7.8 },
    { x: 28, y: 8.9 },
    { x: 32, y: 10.0 },
    { x: 36, y: 11.1 },
    { x: 40, y: 12.2 },
    { x: 44, y: 12.5 },
    { x: 48, y: 13.2 },
    { x: 52, y: 13.8 },
    { x: 56, y: 14.4 },
    { x: 60, y: 15.2 },
    { x: 64, y: 15.4 },
    { x: 68, y: 15.6 },
    { x: 72, y: 15.9 },
    { x: 76, y: 16.2 },
    { x: 80, y: 16.4 },
    { x: 84, y: 16.7 },
    { x: 88, y: 17.0 },
    { x: 92, y: 17.2 },
    { x: 96, y: 17.4 },
    { x: 100, y: 17.4 },
    { x: 104, y: 17.5 },
    { x: 108, y: 17.5 },
    { x: 112, y: 17.5 },
    { x: 116, y: 17.6 },
    { x: 120, y: 17.7 },
    { x: 124, y: 17.6 },
    { x: 128, y: 17.5 },
    { x: 132, y: 17.4 },
    { x: 136, y: 17.4 },
    { x: 140, y: 17.3 },
    { x: 144, y: 17.3 },
    { x: 148, y: 17.4 }
];

function interpolate(x0, y0, x1, y1, x) {
    return y0 + ((y1 - y0) / (x1 - x0)) * (x - x0);
}

function getRiskZone(ageInHours, bilirubin, hasRisk, shouldUsePhototherapy){
    p40AtAge = getYOnCurveByX(percentile40DataPoints, ageInHours);
    p75AtAge = getYOnCurveByX(percentile75DataPoints, ageInHours);
    p95AtAge = getYOnCurveByX(percentile95DataPoints, ageInHours);
    var riskZone = -1;
    
    if (bilirubin >= p95AtAge){
        riskZone = 1;
        percentileString = 'מעל אחוזון 95';
    }
    if (bilirubin >= p75AtAge && bilirubin < p95AtAge){
        riskZone = 2;
        percentile = 75 + ((bilirubin - p75AtAge) / (p95AtAge - p75AtAge)) * 20;
        percentileString = 'אחוזון ' + percentile.toFixed(0);
    }
    if (bilirubin >= p40AtAge && bilirubin < p75AtAge){
        riskZone = 3;
        percentile = 40 + ((bilirubin - p40AtAge) / (p75AtAge - p40AtAge)) * 35;
        percentileString = 'אחוזון ' + percentile.toFixed(0);
    }
    if (bilirubin < p40AtAge){
        riskZone = 4;
        percentileString = 'מתחת לאחוזון 40';
    }
    var explanation = getTrackingStatusByRiskZone(riskZone, hasRisk, shouldUsePhototherapy);
    return { riskZone, percentileString, explanation };
}

function getTrackingStatusByRiskZone(riskZone, hasRisk, shouldUsePhototherapy){
    if ((riskZone === 1) || (riskZone === 2 && hasRisk)){
        if (shouldUsePhototherapy){
            return 'טיפול אור באשפוז';
        }
        else {
            return 'המשך אשפוז עם מעקב בילירובין בסרום כל 8 שעות';
        }
    }
    else if (riskZone === 2 && !hasRisk){
        return 'שחרור עם מעקב בילירובין חוזר תוך 24 שעות';
    }
    else if (riskZone === 4 || (!hasRisk && riskZone === 3)){
        return 'שחרור למעקב שגרתי בקהילה, רופא מטפל וטיפת חלב';
    }
    else if (hasRisk && riskZone === 3 ){
        return 'שחרור עם המלצה למעקב בילירובין חוזר, מלעורי או בסרום, תוך 48 שעות';
    }
}

function getYOnCurveByX(dataPoints, x) {
    // Find the two points between which the X coordinate lies
    var i = 0;
    while (i < dataPoints.length - 1 && dataPoints[i + 1].x < x) {
        i++;
    }

    // Interpolate Y value at X coordinate
    var interpolatedY = interpolate(
    dataPoints[i].x,
    dataPoints[i].y,
    dataPoints[i + 1].x,
    dataPoints[i + 1].y,
    x
    );

return interpolatedY;
}