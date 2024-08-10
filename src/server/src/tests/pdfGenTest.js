import PDFDocument from "pdfkit";
import fs from "fs";
const fcabal = "../../public/asset/fcabal.png";
const image = "../../public/asset/pqImage.jpg";
const ansText = `
Nutrition in health and illness
Based on Maslow’s hierarchy of needs, food and nutrition rank on the same level as air in the basic necessities of life. Obviously, death eventually occurs without food. But unlike air, food does so much more than simply sustain life. Food is loaded with personal, social, and cultural meanings that define our food values, beliefs, and customs. That food nourishes the mind as well as the body broadens nutrition to an art as well as a science. Nutrition is not simply a matter of food or no food but rather a question of what kind, how much, how often, and why. Merging want with need and pleasure with health are keys to feeding the body, mind, and soul. Although the dietitian is the nutrition and food expert, nurses play a vital role in nutrition care. Nurses may be responsible for screening hospitalized patients to identify patients at nutritional risk. They often serve as the liaison between the dietitian and physician as well as with other members of the health-care team. Nurses have far more contact with the patient and family and are often available as a nutrition resource when dietitians are not, such as during the evening, on weekends, and during discharge instructions. In home care and wellness settings, dietitians may be available only on a consultative basis. Nurses may reinforce nutrition counseling provided by the dietitian and may be responsible for basic nutrition education in hospitalized clients with low to mild nutritional risk. Nurses are intimately involved in all aspects of nutritional care. 
NUTRITION SCREENING
Nutrition screening is a quick look at a few variables to identify individuals who are malnourished or who are at risk for malnutrition so that an in-depth nutrition assessment can follow. Screening tools should be simple, reliable, valid, applicable to most patients or clients in the group, and use data that is readily available. For instance, a community-based senior center may use a nutrition screen that focuses mostly on intake risks common to that population (e.g., pregnant women) or for a specific disorder (e.g., cardiac disease). such as whether the client eats alone most of the time and/or has physical limitations that impair the ability to buy or cook food. In contrast, common screening parameters in acute care settings include unintentional weight loss, appetite, body mass index (BMI), and disease severity. Nutrition screening should be conducted within 24 hours after admission to a hospital or other health-care facility—even on weekends and holidays. Each facility can determine screening criteria, how risk is defined and who performs the screening . For instance, a hospital may use serum creatinine level as a screening criterion, with a level greater than 2.5 mg/dL defined as “high risk” because the majority of their patients are elderly and the prevalence of chronic renal problems is high. Because the standard applies 24 hours a day, 7 days a week, staff nurses are often responsible for completing the screen as part of the admission process. Clients who “pass” the initial screen are rescreened after a specified amount of time to determine if their status has changed.
Malnutrition:  literally “bad nutrition” or any nutritional imbalance including overnutrition. In practice, malnutrition usually means undernutrition or an inadequate intake of protein and/or calories that causes loss of fat stores and/or muscle wasting.
Nutritional Assessment: an in-depth analysis of a person’s nutritional status. In the clinical setting, nutritional assessments focus on moderate- to high-risk patients with suspected or confirmed protein energy malnutrition.
Clients considered to be at moderate or high risk for malnutrition through screening are usually referred to a dietitian for a comprehensive nutritional assessment  to identify specific risks or confirm the existence of malnutrition. Nutritional assessment is more accurately called the nutrition care process, which includes four steps. While nurses use the same problem-solving model to develop nursing or multidisciplinary care plans that may also integrate nutrition, the nutritional plan of care devised by dietitians is specific for nutrition problems. Some obvious differences in focus are described below: 
Dietitians may obtain much of their preliminary information about the patient from the nursing history and physical examination, such as height and weight; skin integrity; usual diet prior to admission; difficulty chewing, swallowing, or self-feeding; chief complaint; medications, supplements, and over-the-counter drugs used prior to admission; and living situation. Dietitians may request laboratory tests to assess vitamin levels when micronutrient deficiencies are suspected. Dietitians interview patients and/or families to obtain a nutrition history, which may include information on current dietary habits; recent changes in intake or appetite; intake of snacks; alcohol consumption; food allergies and intolerances; ethnic, cultural, or religious diet influences; nutrition knowledge and beliefs; and use of supplements. A nutrition history can help differentiate nutrition problems caused by inadequate intake from those caused by disease. Dietitians usually calculate estimated calorie and protein requirements based on the assessment data and determine whether the diet ordered is adequate and appropriate for the individual. Dietitians determine nutrition diagnoses that define the nutritional problem, etiology, and signs and symptoms. While a nursing diagnosis statement may begin with “Altered nutrition: eating less than the body needs,” a nutrition diagnosis would be more specific, such as “Inadequate protein–energy intake.” Dietitians may also determine the appropriate malnutrition diagnosis code for the patient for hospital reimbursement purposes. Nutrition interventions may include requesting a diet order change, requesting additional laboratory tests to monitor nutritional repletion, and performing nutrition counselling . 
NUTRITION IN THE NURSING PROCESS 
In nursing care plans, nutrition may be part of the assessment data, diagnosis, plan, implementation, or evaluation. This is intended to help nurses provide quality nursing care that includes basic nutrition, not to help nurses become dietitians. 
Assessment 
Subjective Global Assessment (SGA):  a clinical method of assessing nutritional status based on findings in a health history and physical examination.
 It is well recognized that malnutrition is a major contributor to morbidity, mortality, impaired quality of life, and prolonged hospital stays. However, there is currently no single, universally agreed upon method to assess or diagnose malnutrition. Approaches vary widely and may lack sensitivity (the ability to diagnose all people who are malnourished) and specificity (misdiagnosing a well-nourished person). For instance, albumin and pre-albumin have been used as diagnostic markers of malnutrition. These proteins are now known to be negative acute phase proteins, which means their levels decrease in response to inflammation and physiologic stress. Because they are not specific for nutritional status, failure of these levels to increase with nutrition repletion does not mean that nutrition therapy is inadequate. Although their usefulness in diagnosing malnutrition is limited, these proteins may help identify patients at high risk for morbidity, mortality, and malnutrition (Banh, 2006). BMI and some or all of the components of a subjective global assessment are commonly used to assess nutrition
CRITERIA  INCLUDED  IN  SUBJECTIVE  GLOBAL  ASSESSMENT
Weight Change: Unintentional weight loss and the time period of loss 
Dietary Intake: Change from normal, duration, type of diet consumed
Gastrointestinal Symptoms Lasting Longer than 2 Weeks: Nausea, vomiting, diarrhea, anorexia
Functional Capacity: Normal or suboptimal; ambulatory or bedridden 
Disease and Its Relation to Nutritional Requirements: Primary diagnosis; severity of metabolic stress 
Physical Signs and Severity of Findings: Loss of subcutaneous fat (triceps, chest), muscle wasting (quadriceps, deltoids), ankle edema, sacral edema, ascites
Medical History and Diagnosis 
The chief complaint and medical history may reveal disease-related risks for malnutrition and whether inflammation is present. Patients with gastrointestinal symptoms or disorders are among those who are most prone to malnutrition, particularly when symptoms such as nausea, vomiting, diarrhea, and anorexia last for more than 2 weeks. See lists of psychosocial factors that may impact intake or requirements and help identify nutrition counseling needs.
Body mass index  (BMI) is an index of a person’s weight in relation to height used to estimate relative risk of health problems related to weight. Because it is relatively quick and easy to measure height and weight and requires little skill, actual measures , not estimates ,  should be used whenever possible to ensure accuracy and reliability. A patient’s stated  height and weight should be used only when there are no other options.
Body Mass Index:  an index of weight in relation to height that is calculated mathematically by dividing weight in kilograms by the square of height in meters.
BMI= kg/m2
Interpreting BMI 
18.5	underweight
18.5–24.9	healthy weight
25–29.9	overweight
30–34.	obesity class 1
35–39.9	obesity class 2
40	 obesity class 3
One drawback of using BMI is that a person can have a high BMI and still be undernourished in one or more nutrients if intake is unbalanced or if nutritional needs are high and intake is inadequate.
Weight Change.  Unintentional weight loss is a well-validated indicator of malnutrition. The significance of weight change is evaluated after the percentage of usual body weight lost in a given period of time is calculated (Box 1.3). Usually, weight changes are more reflective of chronic, not acute, changes in nutritional status. The patient’s weight can be unreliable or invalid due to hydration status. Edema, anasarca, fluid resuscitation, heart failure, and chronic liver or renal disease can falsely inflate weigh
Dietary Intake.  A decrease in intake compared to the patient’s normal intake may indicate nutritional risk. 
QUESTIONS  TO  CONSIDER  ABOUT  INTAKE
How many meals and snacks do you eat in a 24-hour period?  This question helps to establish the pattern of eating and identifies unusual food habits such as pica, food faddism, eating disorders, and meal skipping. 
Do you have any food allergies or intolerances, and, if so, what are they?  The greater the number of foods restricted or eliminated in the diet, the greater the likelihood of nutritional deficiencies. This question may also shed light on the client’s need for  nutrition counseling. For instance, clients with hiatal hernia who are intolerant of citrus fruits and juices may benefit from counseling on how to ensure an adequate intake of vitamin C. 
What types of vitamin, mineral, herbal, or other supplements do you use and why?  A multivitamin, multimineral supplement that provides 100% or less of the daily value offers some protection against less than optimal food choices. Folic acid in supplements or  fortified food is recommended for women of childbearing age; people older than 50 years are encouraged to obtain vitamin B 12  from fortified foods or supplements. However,  potential problems may arise from other types or amounts of supplements. For  instance, large doses of vitamins A, B6 , and D have the potential to cause toxicity symptoms. Iron supplements may decrease zinc absorption and negatively impact zinc status over time. 
What concerns do you have about what or how you eat?  This question places the responsibility of healthy eating with the client, where it should be. A client who may benefit from nutrition intervention and counseling in theory  may not be a candidate for such in practice  depending on his or her level of interest and motivation. This question may also shed light on whether or not the client understands what he or she should be eating and whether the client is willing to make changes in eating habits.
For clients who are acutely ill: How has illness affected your choice or tolerance of food?  Sometimes, food aversions or intolerances can shed light on what is going on with the client. For instance, someone who experiences abdominal pain that is relieved by eating may have a duodenal ulcer. Clients with little or no intake of food or liquids are at risk for dehydration and nutrient deficiencies. 
Who prepares the meals? This person may need nutritional counseling. 
Do you have enough food to eat?  Be aware that pride and an unwillingness to admit inability to afford an adequate diet may prevent some clients and families from  answering this question. For hospitalized clients, it may be more useful to ask the  client to compare the size of the meals they are served in the hospital with the size of meals they normally eat. 
How much alcohol do you consume daily?  Risk begins at more than one drink daily for women and more than two drinks daily for men.
PSYCHOSOCIAL  FACTORS  THAT  MAY  INFLUENCE  INTAKE , NUTRITIONAL  REQUIREMENTS , OR  NUTRITION  COUNSELLING
Psychological Factors:  Depression,  Eating disorders,  Psychosis
 Social Factors:  Illiteracy, Language barriers, Limited knowledge of nutrition and food safety, Altered or impaired intake related to culture,  Altered or impaired intake related to religion, Lack of caregiver or social support system,  Social isolation Lack of or inadequate cooking arrangements, Limited or low income,  Limited access to transportation to obtain food, Advanced age (older than 80 years), Lack of or extreme physical activity, Use of tobacco or recreational drugs, Limited use or knowledge of community resources.
PHYSICAL  SYMPTOMS  SUGGESTIVE  OF  MALNUTRITION
Hair that is dull, brittle, or dry, or falls out easily 
Swollen glands of the neck and cheeks 
Dry, rough, or spotty skin that may have a sandpaper feel 
Poor or delayed wound healing or sores 
Thin appearance with lack of subcutaneous fat 
Muscle wasting (decreased size and strength)
 Edema of the lower extremities 
Weakened hand grasp 
 Depressed mood
 Abnormal heart rate, heart rhythm, or blood pressure 
 Enlarged liver or spleen 
Loss of balance and coordination 
Nursing Diagnosis
 A diagnosis is made after assessment data are interpreted. Nursing diagnoses in hospitals and long-term care facilities provide written documentation of the client’s status and serve as a framework for the plan of care that follows. The diagnoses relate directly to nutrition when the pattern of nutrition and metabolism is the problem. Other nursing diagnoses, while not specific for nutrition, may involve nutrition as part of the plan, such as teaching the patient how to increase fiber intake to relieve the nursing diagnosis of constipation.
lists nursing diagnoses with nutritional significance. 
Pattern Nutrition and Metabolic
 High risk for altered nutrition: intake exceeds the body’ s needs 
Altered nutrition: intake exceeds the body’s needs Altered nutrition: eating less than the body needs 
Effective breastfeeding
 Ineffective breastfeeding 
Interrupted breastfeeding
 Ineffective infant feeding pattern
 High risk of aspiration
 Swallowing disorder
 Altered oral mucosa 
High risk for fluid volume deficits Fluid volume deficits 
Excess fluid volume 
High risk for impaired skin integrity
 Impaired skin integrity 
Impaired tissue integrity 
High risk for altered body temperature 
Ineffective thermoregulation 
Hyperthermia 
Hypothermia
Examples of Other Diagnoses in Which Nutrition Interventions May Be Part of the Care Plan Altered health maintenance 
Ineffective management of therapeutic regimen 
Infection 
Constipation
 Diarrhea 
Bowel incontinence 
Altered urinary excretion
 Impaired physical mobility 
Fatigue 
Self-care deficit: feeding
 Household altered
 Altered tissue perfusion 
Pain
 Chronic pain 
Alterations sensory/perceptual 
Unilateral oblivion 
Knowledge deficits 
Anxiety Body image disorder 
Social isolation
 Ineffective individual coping
 Ineffective family coping 
Defensive coping
Planning: Client Outcomes 
Outcomes, or goals, should be measurable, attainable, specific, and client centered. How do you measure success against a vague goal of “gain weight by eating better”? Is “eating better” achieved by adding butter to foods to increase calories or by substituting 1% milk for whole milk because it is heart healthy? Is a 1-pound weight gain in 1 month acceptable or is 1 pound/week preferable? Is 1 pound/week attainable if the client has accelerated metabolism and catabolism caused by third-degree burns? Client-centered outcomes place the focus on the client, not the health-care provider; they specify where the client is heading. Whenever possible, give the client the opportunity to actively participate in goal setting, even if the client’s perception of need differs from yours. In matters that do not involve life or death, it is best to first address the client’s concerns. Your primary consideration may be the patient’s significant weight loss during the last 6 months of chemotherapy, whereas the patient’s major concern may be fatigue. The two issues are undoubtedly related, but your effectiveness as a change agent is greater if you approach the problem from the client’s perspective. Commitment to achieving the goal is greatly increased when the client “owns” the goal. Keep in mind that the goal for all clients is to consume adequate calories, protein, and nutrients using foods they like and tolerate as appropriate. If possible, additional short-term goals may be set to alleviate symptoms or side effects of disease or treatments and to prevent complications or recurrences if appropriate. After short-term goals are met, attention can expand to promoting healthy eating to reduce the risk of chronic diet-related diseases such as obesity, diabetes, hypertension, and atherosclerosis.
How the Body Handles Carbohydrates 
Digestion 
Cooked starch begins to undergo digestion in the mouth by the action of salivary amylase, but the overall effect is small because food is not held in the mouth very long (Fig. 2.4). The stomach churns and mixes its contents, but its acid medium halts any residual effect of the swallowed amylase. Most carbohydrate digestion occurs in the small intestine, where pancreatic amylase reduces complex carbohydrates into shorter chains and disaccharides. Disaccharidase enzymes (maltase, sucrase, and lactase) on the surface of the cells of the small intestine split maltose, sucrose, and lactose, respectively, into monosaccharides. Monosaccharides are the only form of carbohydrates the body is able to absorb intact and the form all other digestible carbohydrates must be reduced to before they can be absorbed. Normally, 95% of starch is digested usually within 1 to 4 hours after eating. 
Absorption 
Glucose, fructose, and galactose are absorbed through intestinal mucosa cells and travel to the liver via the portal vein. Small amounts of starch that have not been fully digested pass into the colon with fiber and are excreted in the stools. Fibers may impair the absorption of some minerals—namely, calcium, zinc, and iron—by binding with them in the small intestine.
Metabolism
 Fructose and galactose are converted to glucose in the liver. The liver releases glucose into the bloodstream, where its level is held fairly constant by the action of hormones. A rise in blood glucose concentration after eating causes the pancreas to secrete insulin, which moves glucose out of the bloodstream and into the cells. Most cells take only as much glucose as they need for immediate energy needs; muscle and liver cells take extra glucose to store as glycogen. The release of insulin lowers blood glucose to normal levels. In the postprandial state, as the body uses the energy from the last meal, the blood glucose concentration begins to drop. Even a slight fall in blood glucose stimulates the pancreas to release glucagon, which causes the liver to release glucose from its supply of glycogen. The result is that blood glucose levels increase to normal.
Functions of Carbohydrates
 Glucose metabolism is a dynamic state of balance between burning glucose for energy ( catabolism ) and using glucose to build other compounds ( anabolism ). This process is a continuous response to the supply of glucose from food and the demand for glucose for energy needs.
 Glucose for Energy 
The primary function of carbohydrates is to provide energy for cells. Glucose is burned more efficiently and more completely than either protein or fat, and it does not leave an end product that the body must excrete. Although muscles use a mixture of fat and glucose for energy, the brain is totally dependent on glucose for energy. All digestible carbohydrates— namely, simple sugars and complex carbohydrates—provide 4 cal/g. As a primary source of energy, carbohydrates also spare protein and prevent ketosis. 
Protein Sparing. 
Although protein provides 4 cal/g just like carbohydrates, it has other specialized functions that only protein can perform, such as replenishing enzymes, hormones, antibodies, and blood cells. Consuming adequate carbohydrate to meet energy needs has the effect of “sparing protein” from being used for energy, leaving it available to do its special functions. An adequate carbohydrate intake is especially important whenever protein needs are increased such as for wound healing and during pregnancy and lactation. 
Preventing Ketosis. 
Fat normally supplies about half of the body’s energy requirement. Yet glucose fragments are needed to efficiently and completely burn fat for energy. Without adequate  glucose, fat oxidation prematurely stops at the intermediate step of ketone body  formation. Although muscles and other tissues can use ketone bodies for energy, they are normally produced only in small quantities. An increased production of ketone bodies and their accumulation in the bloodstream cause nausea, fatigue, loss of appetite, and ketoacidosis. Dehydration and sodium depletion may follow as the body tries to excrete ketones in the urine.
Ketone Bodies:  intermediate, acidic compounds formed from the incomplete breakdown of fat when adequate glucose is not available
Using Glucose to Make Other Compounds
 After energy needs are met, excess glucose can be converted to glycogen, be used to make nonessential amino acids and specific body compounds, or be converted to fat and stored. 
A). Glycogen.  The body’s backup supply of glucose is liver glycogen. Liver and muscle cells pick up extra glucose molecules during times of plenty and join them together to form glycogen, which can quickly release glucose in times of need. Typically one-third of the body’s glycogen reserve is in the liver and can be released into circulation for all body cells to use, and two-thirds is in muscle, which is available only for use by muscles. Unlike fat, glycogen storage is limited and may provide only enough calories for about a half-day of moderate activity.
B).  Nonessential Amino Acids.  If an adequate supply of essential amino acids is available, the body can use them and glucose to make nonessential amino acids. 
C). Carbohydrate-Containing Compounds.  The body can convert glucose to other essential carbohydrates such as ribose, a component of ribonucleic acid (RNA) and deoxyribonucleic acid (DNA), keratin sulfate (in fingernails), and hyaluronic acid (found in the fluid that lubricates the joints and vitreous humor of the eyeball). 
D). Fat.  Any glucose remaining at this point—after energy needs are met, glycogen stores are saturated, and other specific compounds are made—is converted by liver cells to triglycerides and stored in the body’s fat tissue. The body does this by combining acetate molecules to form fatty acids, which then are combined with glycerol to make triglycerides. Although it sounds easy for excess carbohydrates to be converted to fat, it is not a primary pathway; the body prefers to make body fat from dietary fat, not carbohydrates.
PROTEIN 
Amino acids are the basic building blocks of all proteins and the end products of protein digestion. All amino acids have a carbon atom core with four bonding sites: one site holds a hydrogen atom, one an amino group (NH 2 ), and one an acid group (COOH). Attached to the fourth bonding site is a side group (R group), which contains the atoms that give each amino acid its own distinct identity. Some side groups contain sulfur, some are acidic, and some are basic. The differences in these side groups account for the differences in size, shape, and electrical charge among amino acids. There are 20 common amino acids, 9 of which are classified as essential or indispensable because the body cannot make them so they must be supplied through the diet. The remaining 11 amino acids are classified as nonessential or dispensable because cells can make them as needed through the process of transamination. Some dispensable amino acids may become indispensable when metabolic need is great and endogenous synthesis is not adequate. Note that the terms essential and nonessential refer to whether or not they must be supplied by the diet, not to their relative importance: all 20 amino acids must be available for the body to make proteins.
Essential (Indispensable) Histidine
Isoleucine
Leucine
Lysine
Methionine
Phenylalanine
Threonine 
Tryptophan 
Valine	Nonessential (Dispensable) Alanine
Asparagine
Aspartic acid
Glutamic acid
Serine
Arginine
Cysteine
Glutamine
Glycine
Proline
Tyrosine
Functions of Protein 
Protein is the major structural and functional component of every living cell. Except for bile and urine, every tissue and fluid in the body contains some protein. In fact, the body may contain as many as 10,000 to 50,000 different proteins that vary in size, shape, and function. Amino acids or proteins are components of or involved in the following: 
Body structure and framework . More than 40% of protein in the body is found in  skeletal muscle, and approximately 15% is found in each the skin and the blood. Proteins also form tendons, membranes, organs, and bones.
 Enzymes . Enzymes are proteins that facilitate specific chemical reactions in the body without  undergoing change themselves. Some enzymes (e.g., digestive enzymes) break down larger molecules into smaller ones; others (e.g., enzymes involved in protein synthesis in which amino acids are combined) combine molecules to form larger compounds. 
Other body secretions and fluids . Neurotransmitters (e.g., serotonin, acetylcholine), antibodies, and some hormones (e.g., insulin, thyroxine, epinephrine) are made from amino acids, as are breast milk, mucus, sperm, and histamine. 
Proteins help to regulate fluid balance because they attract water, which creates osmotic pressure. Circulating proteins, such as albumin, maintain the proper balance of fluid among the intravascular , intracellular , and interstitial  compartments of the body . A symptom of a low albumin level is edema . 
Acid–base balance . Because amino acids contain both an acid (COOH) and a base (NH 2 ), they can act as either acids or bases depending on the pH of the surrounding fluid. The ability to buffer or neutralize excess acids and bases enables proteins to maintain normal blood pH, which protects body proteins from being denatured . 
Transport molecules . Globular  proteins transport other substances through the blood. For instance, lipoproteins transport fats, cholesterol, and fat-soluble vitamins; hemoglobin transports oxygen; and albumin transports free fatty acids and many drugs. 
Other compounds. Amino acids are components of numerous body compounds such as opsin, the light-sensitive visual pigment in the eye, and thrombin, a protein necessary for normal blood clotting. Some amino acids have specific functions within the body. For instance, tryptophan is a precursor of the vitamin niacin and is also a component of serotonin. Tyrosine is the precursor of melanin, the pigment that colors hair and skin and is incorporated into thyroid hormone. 
Fueling the body . Like carbohydrates, protein provides 4 cal/g. Although it is not the body’s preferred fuel, protein is a source of energy when it is consumed in excess or when calorie intake from carbohydrates and fat is inadequate.
How the Body Handles Protein
 Digestion 
Chemical digestion of protein begins in the stomach, where hydrochloric acid denatures protein to make the peptide bonds more available to the actions of enzymes. Hydrochloric acid also converts pepsinogen to the active enzyme pepsin, which begins the process of breaking down proteins into smaller polypeptides and some amino acids. The majority of protein digestion occurs in the small intestine, where pancreatic proteases reduce polypeptides to shorter chains, tripeptides, dipeptides, and amino acids. The enzymes trypsin and chymotrypsin act to break peptide bonds between specific amino acids. Carboxypeptidase breaks off amino acids from the acid (carboxyl) end of polypeptides and dipeptides. Enzymes located on the surface of the cells that line the small intestine complete the digestion: aminopeptidase splits amino acids from the amino ends of short peptides, and dipeptidase reduces dipeptides to amino acids. Protein digestibility  is 90% to 99% for animal proteins, over 90% for soy and legumes, and 70% to 90% for other plant proteins.
Absoption 
Amino acids, and sometimes a few dipeptides or larger peptides, are absorbed through the mucosa of the small intestine by active transport with the aid of vitamin B 6 . Intestinal cells release amino acids into the bloodstream for transport to the liver via the portal vein.
Metabolism 
The liver acts as a clearinghouse for the amino acids it receives: it uses the amino acids it needs, releases those needed elsewhere, and handles the extra. For instance, the liver  
Retains amino acids to make liver cells, nonessential amino acids, and plasma proteins such as heparin, prothrombin, and albumin
 Regulates the release of amino acids into the bloodstream and removes excess amino acids from the circulation 
Synthesizes specific enzymes to degrade excess amino acids 
Removes the nitrogen from amino acids so that they can be burned for energy Converts certain amino acids to glucose, if necessary
 Forms urea from the nitrogenous wastes when protein and calories are consumed in excess of need 
Converts protein to fatty acids that form triglycerides for storage in adipose tissue 
Protein Deficiency
Protein–energy malnutrition (PEM) occurs when protein, calories, or both are deficient in the diet. Kwashiorkor and marasmus are generally viewed as two distinctly different forms of PEM , yet there is controversy as to whether kwashiorkor and marasmus simply represent the same disease at different stages. Some studies suggest that marasmus occurs when the body has adapted to starvation and kwashiorkor arises when adaptation to starvation fails due to illness. 
 Although PEM can affect people of any country or age, it is most prevalent in developing countries and in children under the age of 5 years. Approximately 50% of the 10 million annual deaths in developing countries are directly or indirectly blamed on malnutrition in children aged 5 years or younger. 
In the United States, PEM occurs secondary to chronic diseases, such as cancer, AIDS, and chronic pulmonary disease. It may also be seen among homeless people, fad dieters, adults who are addicted to drugs or alcohol, and people with eating disorders. Some studies show that PEM affects 30% to 40% of elderly in long-term care and 50% of hospitalized elderly people. 
In both children and adults, nutrition therapy begins with correcting fluid and electrolyte imbalances and treating infection. Within 48 hours, macronutrients are provided at a level the patient tolerates; the diet is gradually advanced as tolerated. Actual protein and calorie needs may be double that of normal.
Kwashiorkor:  a type of protein–energy  malnutrition resulting from a deficiency of protein or infections. 
Marasmus:  a type of protein–energy  malnutrition resulting from severe deficiency or impaired absorption of calories, protein, vitamins, and minerals.
`;
const testPdf = async () => {

  const doc = new PDFDocument({
    size: "letter"
  });

  const courseTitle = "introduction to anatomy";
  const courseCode = "ANA201";
  const session = "2020/2021";
  const level = 100;
  const school = "AUO";
  const answer =
    "Anatomy deals with the study of body structures, positions and planes";

  doc.info.Title = "Pastquestion";
  doc.info.Author = "FrontiersCabal";
  doc.info.Subject = courseTitle;
  doc.info.Keywords = `pastquestion, answers, FrontiersCabal, Fc, ${courseCode}, ${courseTitle}, ${school}, ${level}`;
  doc.info.Producer = "FrontiersCabal";
  doc.info.Creator = "FrontiersCabal";

  doc.font("Times-Roman");

  doc
    .image(fcabal, 25, 25, { width: 80 })
    .moveDown(2);
  doc
    .fontSize(10)
    .font("Helvetica-Oblique")
    .text("Learning never exhaust the mind...", { align: "center" })
    .moveDown(10);
  const startX = 50;
  const startY = 120;

  const boxWidth = 250;
  const boxHeight = 110;
  const ruleY = 30;
  const ruleX1 = 0;
  const ruleX2 = doc.page.width;
  const MARGIN = 10;
  doc.rect(startX, startY, boxWidth, boxHeight).fill("#176984");

  doc
    .fontSize(12)
    .fillColor("#fff")
    .font("Times-Bold")
    .text(`Course Title: ${courseTitle}`, startX + 10, startY + 10, {
      align: "left",
    })
    .moveDown();
  doc
    .fontSize(12)
    .fillColor("#fff")
    .font("Times-Bold")
    .text(`Course Code: ${courseCode}`, startX + 10, startY + 30, {
      align: "left",
    })
    .moveDown();
  doc
    .fontSize(12)
    .fillColor("#fff")
    .font("Times-Bold")
    .text(`Level: ${level}`, startX + 10, startY + 50, { align: "left" })
    .moveDown();
  doc
    .fontSize(12)
    .fillColor("#fff")
    .font("Times-Bold")
    .text(`Session: ${session}`, startX + 10, startY + 70, { align: "left" })
    .moveDown();
  doc
    .fontSize(12)
    .fillColor("#fff")
    .font("Times-Bold")
    .text(`School: ${school}`, startX + 10, startY + 90, { align: "left" })
    .moveDown(3);

    if (typeof image === "string") {
      doc.image(image, {
        fit: [500, 500],
        align: "center",
        valign: "center",
      });
    } else {
      for (let i = 0; i < image?.length; i++) {
        doc.image(image[i], {
          fit: [500, 500],
          align: "center",
          valign: "center",
        });
        if (i < image.length - 1) {
          doc.addPage({ margin: MARGIN });
        }
      }
    }
 
   
if(ansText){
  doc.addPage({margin:MARGIN});
  doc.fontSize(18).font("Times-Bold").text("Answer");
  doc.moveTo(ruleX1, ruleY).lineTo(ruleX2, ruleY).stroke("#ccc").moveDown();

  const lines = ansText.split("\n");
  for (const line of lines) {
    if (doc.y+doc.heightOfString(line) > 750) {
      doc.addPage({margin:MARGIN});
    }
    doc.fontSize(14).text(line, 10, doc.y, {align: "justify",lineGap: 10});
  }

  doc.addPage({margin:MARGIN});
  doc.fontSize(18).font("Times-Bold").text("Reference");
  doc.moveTo(ruleX1, ruleY).lineTo(ruleX2, ruleY).stroke("#ccc").moveDown();
  doc.fontSize(10).text("reference", { align: "justify" }).addPage({margin:MARGIN});

  doc.fontSize(18).font("Times-Bold").text("Note");
  doc.moveTo(ruleX1, ruleY).lineTo(ruleX2, ruleY).stroke("#ccc").moveDown();
  doc
    .fontSize(12)
    .font("Helvetica-Oblique")
    .text(
      "These answers were meticulously compiled from various sources.However, Users of this material are advised to exercise caution and independently verify the information provided therein.",
      { align: "justify" }
    );
}
 

  const outputStream = fs.createWriteStream("testPdf.pdf");
  doc.pipe(outputStream);
  await new Promise((resolve, reject) => {
    outputStream.on("finish", resolve);
    outputStream.on("error", reject);
    doc.end();
  });
};

testPdf();
