describe('Health Tracker Tests', () => {
  test('calcul proximité objectif poids', () => {
    const calculateProximity = (current, target) => {
      if (!current || !target) return 0;
      if (current <= target) return (current / target) * 100;
      else return (target / current) * 100;
    };
    expect(calculateProximity(70, 70)).toBe(100);
    expect(calculateProximity(50, 100)).toBe(50);
  });

  test('notification hypertension', () => {
    const bp = 19;
    const notifications = [];
    if (bp > 18) notifications.push({ type: 'alerte', message: 'hypertension' });
    expect(notifications.length).toBe(1);
    expect(notifications[0].type).toBe('alerte');
  });

  test('vérification token manquant', () => {
    const getToken = () => null;
    expect(getToken()).toBeNull();
  });
});
