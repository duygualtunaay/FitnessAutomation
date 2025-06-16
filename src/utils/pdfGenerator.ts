import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface DietPlan {
  dailyCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  recommendations: string[];
  restrictions: string[];
  supplements: string[];
  mealPlan: {
    breakfast: string[];
    lunch: string[];
    dinner: string[];
    snacks: string[];
  };
  healthInsights: string[];
}

interface BloodTestResult {
  parameter: string;
  value: number;
  unit: string;
  normalRange: string;
  status: 'normal' | 'high' | 'low';
}

export const generateDietPlanPDF = (
  dietPlan: DietPlan, 
  bloodResults: BloodTestResult[], 
  userName: string
) => {
  const doc = new jsPDF();
  
  // Set font for Turkish characters
  doc.setFont('helvetica');
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(59, 130, 246); // Blue color
  doc.text('Kişiselleştirilmiş Beslenme Planı', 20, 25);
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Hazırlanan: ${userName}`, 20, 35);
  doc.text(`Tarih: ${new Date().toLocaleDateString('tr-TR')}`, 20, 42);
  
  // Line separator
  doc.setDrawColor(59, 130, 246);
  doc.line(20, 50, 190, 50);
  
  let yPosition = 60;
  
  // Daily Calories and Macros
  doc.setFontSize(16);
  doc.setTextColor(34, 197, 94); // Green color
  doc.text('Günlük Hedefler', 20, yPosition);
  yPosition += 10;
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Günlük Kalori: ${dietPlan.dailyCalories} kcal`, 20, yPosition);
  yPosition += 8;
  doc.text(`Protein: ${dietPlan.macros.protein}% | Karbonhidrat: ${dietPlan.macros.carbs}% | Yağ: ${dietPlan.macros.fat}%`, 20, yPosition);
  yPosition += 15;
  
  // Meal Plan
  doc.setFontSize(16);
  doc.setTextColor(168, 85, 247); // Purple color
  doc.text('Günlük Öğün Planı', 20, yPosition);
  yPosition += 10;
  
  const meals = [
    { title: 'Kahvaltı', items: dietPlan.mealPlan.breakfast },
    { title: 'Öğle Yemeği', items: dietPlan.mealPlan.lunch },
    { title: 'Akşam Yemeği', items: dietPlan.mealPlan.dinner },
    { title: 'Ara Öğünler', items: dietPlan.mealPlan.snacks }
  ];
  
  meals.forEach(meal => {
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(meal.title, 20, yPosition);
    yPosition += 8;
    
    doc.setFontSize(10);
    meal.items.forEach(item => {
      doc.text(`• ${item}`, 25, yPosition);
      yPosition += 6;
    });
    yPosition += 5;
    
    // Check if we need a new page
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
  });
  
  // Recommendations
  if (yPosition > 200) {
    doc.addPage();
    yPosition = 20;
  }
  
  doc.setFontSize(16);
  doc.setTextColor(34, 197, 94);
  doc.text('Öneriler', 20, yPosition);
  yPosition += 10;
  
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  dietPlan.recommendations.forEach(rec => {
    doc.text(`• ${rec}`, 20, yPosition);
    yPosition += 6;
  });
  yPosition += 10;
  
  // Restrictions
  doc.setFontSize(16);
  doc.setTextColor(239, 68, 68); // Red color
  doc.text('Kısıtlamalar', 20, yPosition);
  yPosition += 10;
  
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  dietPlan.restrictions.forEach(restriction => {
    doc.text(`• ${restriction}`, 20, yPosition);
    yPosition += 6;
  });
  yPosition += 10;
  
  // Supplements
  doc.setFontSize(16);
  doc.setTextColor(168, 85, 247);
  doc.text('Önerilen Takviyeler', 20, yPosition);
  yPosition += 10;
  
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  dietPlan.supplements.forEach(supplement => {
    doc.text(`• ${supplement}`, 20, yPosition);
    yPosition += 6;
  });
  
  // Blood Test Results (if space allows, otherwise new page)
  if (yPosition > 200) {
    doc.addPage();
    yPosition = 20;
  } else {
    yPosition += 15;
  }
  
  doc.setFontSize(16);
  doc.setTextColor(59, 130, 246);
  doc.text('Kan Tahlili Sonuçları', 20, yPosition);
  yPosition += 10;
  
  // Create table for blood results
  const tableData = bloodResults.map(result => [
    result.parameter,
    `${result.value} ${result.unit}`,
    result.normalRange,
    result.status === 'normal' ? 'Normal' : result.status === 'high' ? 'Yüksek' : 'Düşük'
  ]);
  
  (doc as any).autoTable({
    head: [['Parametre', 'Değer', 'Normal Aralık', 'Durum']],
    body: tableData,
    startY: yPosition,
    theme: 'grid',
    headStyles: { fillColor: [59, 130, 246] },
    styles: { fontSize: 9 }
  });
  
  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text('Fitness Hub - AI Beslenme Uzmanı', 20, 285);
    doc.text(`Sayfa ${i} / ${pageCount}`, 170, 285);
  }
  
  // Save the PDF
  doc.save(`${userName}_Beslenme_Plani_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const generateWorkoutPlanPDF = (workoutPlan: any, userName: string) => {
  const doc = new jsPDF();
  
  doc.setFont('helvetica');
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(59, 130, 246);
  doc.text('Kişiselleştirilmiş Antrenman Programı', 20, 25);
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Hazırlanan: ${userName}`, 20, 35);
  doc.text(`Tarih: ${new Date().toLocaleDateString('tr-TR')}`, 20, 42);
  
  doc.setDrawColor(59, 130, 246);
  doc.line(20, 50, 190, 50);
  
  let yPosition = 60;
  
  // Workout days
  workoutPlan.weeklyPlan.forEach((day: any, index: number) => {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(16);
    doc.setTextColor(34, 197, 94);
    doc.text(`${day.day} - ${day.focus}`, 20, yPosition);
    yPosition += 10;
    
    day.exercises.forEach((exercise: any) => {
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`• ${exercise.name}`, 25, yPosition);
      yPosition += 6;
      doc.setFontSize(10);
      doc.text(`  ${exercise.sets} set x ${exercise.reps} tekrar`, 30, yPosition);
      yPosition += 6;
      if (exercise.notes) {
        doc.text(`  Not: ${exercise.notes}`, 30, yPosition);
        yPosition += 6;
      }
      yPosition += 2;
    });
    yPosition += 10;
  });
  
  doc.save(`${userName}_Antrenman_Programi_${new Date().toISOString().split('T')[0]}.pdf`);
};