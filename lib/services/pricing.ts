export function calculatePerfumePricing(cost: number) {

    let multiplier = 2;

    if (cost <= 100) multiplier = 3;
    else if (cost <= 200) multiplier = 2.55;
    else if (cost <= 300) multiplier = 2.25;
    else if (cost <= 400) multiplier = 2;

    const full = cost * multiplier;

    // 🔥 preço por ml (base 100ml)
    const pricePerMl = full / 100;

    // margem maior no 5ml
    const decant5 = pricePerMl * 5 * 1.6;

    // margem média no 10ml
    const decant10 = pricePerMl * 10 * 1.4;

    return {
        full: roundPrice(full),
        decant5: roundPrice(decant5),
        decant10: roundPrice(decant10),
    };
}

// 💰 arredondamento comercial
function roundPrice(value: number) {

    if (value < 100) {
        return Math.floor(value) + 0.9;
    }

    return Math.round(value / 10) * 10 - 1;
}