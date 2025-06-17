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

interface AICoachResponse {
  strategicAnalysis: string;
  macroNutrientPlan: {
    dailyCalories: number;
    protein: number;
    carbs: number;
    fat: number;
    reasoning: string;
  };
  weeklyNutritionPlan: {
    [key: string]: {
      breakfast: string[];
      lunch: string[];
      dinner: string[];
      snacks: string[];
      purpose: string;
    };
  };
  mealPrepGuide: {
    title: string;
    steps: string[];
  };
  shoppingList: {
    [category: string]: string[];
  };
  progressMetrics: {
    metric: string;
    description: string;
    target: string;
  }[];
  importantWarning: string;
}

export const generateDietPlanPDF = (
  aiResponse: AICoachResponse | DietPlan, 
  bloodResults: BloodTestResult[], 
  userName: string
) => {
  const doc = new jsPDF();
  
  // Set font for Turkish characters
  doc.setFont('helvetica');
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(59, 130, 246); // Blue color
  doc.text('AI Performans ve Beslenme Kocu Plani', 20, 25);
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Hazirlanan: ${userName}`, 20, 35);
  doc.text(`Tarih: ${new Date().toLocaleDateString('tr-TR')}`, 20, 42);
  
  // Line separator
  doc.setDrawColor(59, 130, 246);
  doc.line(20, 50, 190, 50);
  
  let yPosition = 60;

  // Check if it's the new AI response format
  const isAIResponse = 'strategicAnalysis' in aiResponse;
  
  if (isAIResponse) {
    const aiData = aiResponse as AICoachResponse;
    
    // Strategic Analysis
    doc.setFontSize(16);
    doc.setTextColor(34, 197, 94);
    doc.text('1. Stratejik Analiz ve Yol Haritasi', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    const analysisLines = doc.splitTextToSize(aiData.strategicAnalysis, 170);
    doc.text(analysisLines, 20, yPosition);
    yPosition += analysisLines.length * 5 + 10;
    
    // Macro Plan
    doc.setFontSize(16);
    doc.setTextColor(34, 197, 94);
    doc.text('2. Hedef Odakli Makro Besin Plani', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Gunluk Kalori: ${aiData.macroNutrientPlan.dailyCalories} kcal`, 20, yPosition);
    yPosition += 8;
    doc.text(`Protein: ${aiData.macroNutrientPlan.protein}% | Karbonhidrat: ${aiData.macroNutrientPlan.carbs}% | Yag: ${aiData.macroNutrientPlan.fat}%`, 20, yPosition);
    yPosition += 8;
    
    doc.setFontSize(10);
    const reasoningLines = doc.splitTextToSize(aiData.macroNutrientPlan.reasoning, 170);
    doc.text(reasoningLines, 20, yPosition);
    yPosition += reasoningLines.length * 5 + 15;
    
    // Weekly Plan
    if (yPosition > 200) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(16);
    doc.setTextColor(168, 85, 247);
    doc.text('3. Dinamik Haftalik Beslenme Plani', 20, yPosition);
    yPosition += 15;
    
    Object.entries(aiData.weeklyNutritionPlan).forEach(([day, plan]) => {
      if (yPosition > 240) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(day, 20, yPosition);
      yPosition += 6;
      
      doc.setFontSize(9);
      doc.setTextColor(59, 130, 246);
      doc.text(plan.purpose, 20, yPosition);
      yPosition += 8;
      
      doc.setFontSize(8);
      doc.setTextColor(0, 0, 0);
      
      // Breakfast
      doc.text('Kahvalti:', 20, yPosition);
      yPosition += 4;
      plan.breakfast.forEach(item => {
        doc.text(`• ${item}`, 25, yPosition);
        yPosition += 3;
      });
      yPosition += 2;
      
      // Lunch
      doc.text('Ogle:', 20, yPosition);
      yPosition += 4;
      plan.lunch.forEach(item => {
        doc.text(`• ${item}`, 25, yPosition);
        yPosition += 3;
      });
      yPosition += 2;
      
      // Dinner
      doc.text('Aksam:', 20, yPosition);
      yPosition += 4;
      plan.dinner.forEach(item => {
        doc.text(`• ${item}`, 25, yPosition);
        yPosition += 3;
      });
      yPosition += 2;
      
      // Snacks
      doc.text('Ara Ogun:', 20, yPosition);
      yPosition += 4;
      plan.snacks.forEach(item => {
        doc.text(`• ${item}`, 25, yPosition);
        yPosition += 3;
      });
      yPosition += 8;
    });
    
    // Meal Prep Guide
    if (yPosition > 200) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(16);
    doc.setTextColor(245, 158, 11);
    doc.text('4. ' + aiData.mealPrepGuide.title, 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    aiData.mealPrepGuide.steps.forEach(step => {
      const stepLines = doc.splitTextToSize(step, 170);
      doc.text(stepLines, 20, yPosition);
      yPosition += stepLines.length * 5 + 3;
    });
    yPosition += 10;
    
    // Shopping List
    if (yPosition > 200) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(16);
    doc.setTextColor(236, 72, 153);
    doc.text('5. Haftalik Alisveris Listesi', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    Object.entries(aiData.shoppingList).forEach(([category, items]) => {
      doc.setFontSize(12);
      doc.text(category, 20, yPosition);
      yPosition += 6;
      
      doc.setFontSize(9);
      items.forEach(item => {
        doc.text(`• ${item}`, 25, yPosition);
        yPosition += 4;
      });
      yPosition += 5;
    });
    
    // Progress Metrics
    if (yPosition > 200) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(16);
    doc.setTextColor(6, 182, 212);
    doc.text('6. Ilerleme Takibi Icin Metrikler', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    aiData.progressMetrics.forEach(metric => {
      doc.setFontSize(11);
      doc.text(metric.metric, 20, yPosition);
      yPosition += 5;
      
      doc.setFontSize(9);
      const descLines = doc.splitTextToSize(metric.description, 170);
      doc.text(descLines, 25, yPosition);
      yPosition += descLines.length * 4;
      
      doc.setTextColor(34, 197, 94);
      doc.text(`Hedef: ${metric.target}`, 25, yPosition);
      yPosition += 8;
      doc.setTextColor(0, 0, 0);
    });
    
    // Important Warning
    if (yPosition > 220) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(14);
    doc.setTextColor(239, 68, 68);
    doc.text('ONEMLI UYARI', 20, yPosition);
    yPosition += 8;
    
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    const warningLines = doc.splitTextToSize(aiData.importantWarning, 170);
    doc.text(warningLines, 20, yPosition);
    
  } else {
    // Legacy format support
    const dietPlan = aiResponse as DietPlan;
    
    // Daily Calories and Macros
    doc.setFontSize(16);
    doc.setTextColor(34, 197, 94);
    doc.text('Gunluk Hedefler', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Gunluk Kalori: ${dietPlan.dailyCalories} kcal`, 20, yPosition);
    yPosition += 8;
    doc.text(`Protein: ${dietPlan.macros.protein}% | Karbonhidrat: ${dietPlan.macros.carbs}% | Yag: ${dietPlan.macros.fat}%`, 20, yPosition);
    yPosition += 15;
    
    // Meal Plan
    doc.setFontSize(16);
    doc.setTextColor(168, 85, 247);
    doc.text('Gunluk Ogun Plani', 20, yPosition);
    yPosition += 10;
    
    const meals = [
      { title: 'Kahvalti', items: dietPlan.mealPlan.breakfast },
      { title: 'Ogle Yemegi', items: dietPlan.mealPlan.lunch },
      { title: 'Aksam Yemegi', items: dietPlan.mealPlan.dinner },
      { title: 'Ara Ogunler', items: dietPlan.mealPlan.snacks }
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
      
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
    });
  }
  
  // Blood Test Results
  if (yPosition > 200) {
    doc.addPage();
    yPosition = 20;
  } else {
    yPosition += 15;
  }
  
  doc.setFontSize(16);
  doc.setTextColor(59, 130, 246);
  doc.text('Kan Tahlili Sonuclari', 20, yPosition);
  yPosition += 10;
  
  // Create table for blood results
  const tableData = bloodResults.map(result => [
    result.parameter,
    `${result.value} ${result.unit}`,
    result.normalRange,
    result.status === 'normal' ? 'Normal' : result.status === 'high' ? 'Yuksek' : 'Dusuk'
  ]);
  
  (doc as any).autoTable({
    head: [['Parametre', 'Deger', 'Normal Aralik', 'Durum']],
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
    doc.text('Fitness Hub - AI Performans ve Beslenme Kocu', 20, 285);
    doc.text(`Sayfa ${i} / ${pageCount}`, 170, 285);
  }
  
  // Save the PDF
  doc.save(`${userName}_AI_Beslenme_Plani_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const generateWorkoutPlanPDF = (workoutPlan: any, userName: string) => {
  const doc = new jsPDF();
  
  doc.setFont('helvetica');
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(59, 130, 246);
  doc.text('Kisisellestirilmis Antrenman Programi', 20, 25);
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Hazirlanan: ${userName}`, 20, 35);
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