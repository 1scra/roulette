function spin() {
    const wheel = document.getElementById('wheel');
    const sectors = wheel.querySelectorAll('.sector');

    // Définissez des chances aléatoires pour chaque secteur
    const chances = [0.2, 0.1, 0.15, 0.1, 0.2, 0.25];

    // Générez un nombre aléatoire entre 0 et la somme des chances
    const totalChances = chances.reduce((acc, chance) => acc + chance, 0);
    const randomNum = Math.random() * totalChances;

    // Trouvez le secteur correspondant au nombre aléatoire
    let cumulativeChances = 0;
    let winningSector = null;

    for (let i = 0; i < chances.length; i++) {
        cumulativeChances += chances[i];

        if (randomNum <= cumulativeChances) {
            winningSector = sectors[i];
            break;
        }
    }

    // Faites tourner la roue pour montrer le secteur gagnant
    const rotationAngle = 360 - (360 / chances.length) * Array.from(sectors).indexOf(winningSector);
    wheel.style.transition = 'transform 3s ease-out';
    wheel.style.transform = `rotate(${rotationAngle}deg)`;

    // Réinitialisez la transition après l'animation
    setTimeout(() => {
        wheel.style.transition = 'none';
        wheel.style.transform = 'rotate(0deg)';
    }, 3000);
}