// CMS CY2026 Medicare PFS National RVU file, October release (RVU26D, PPRRVU2026_Oct_nonQPP, released 08/26/2026).
// Format: CPT|work RVU (= modifier 26 work RVU)|modality|display name|search tags
// CPT codes and descriptions copyright 2026 American Medical Association.
self.WRVU_RAW = `10004|0.78|R|FNA w/o imaging each addl|
10005|1.42|R|FNA w/ US guidance first lesion|
10006|0.98|R|FNA w/ US guidance each addl|
10007|1.76|R|FNA w/ fluoro guidance first lesion|
10008|1.15|R|FNA w/ fluoro guidance each addl|
10009|2.2|R|FNA w/ CT guidance first lesion|
10010|1.61|R|FNA w/ CT guidance each addl|
10021|1|R|FNA w/o imaging first lesion|
10030|2.68|R|Image-guided fluid collection drainage (soft tissue)|
19081|3.21|R|Breast biopsy stereotactic first lesion|
19082|1.61|R|Breast biopsy stereotactic each addl|
19083|3.02|R|Breast biopsy US-guided first lesion|
19084|1.51|R|Breast biopsy US-guided each addl|
19085|3.55|R|Breast biopsy MRI-guided first lesion|
19086|1.77|R|Breast biopsy MRI-guided each addl|
19281|1.95|R|Breast localization mammo first lesion|
19282|0.98|R|Breast localization mammo each addl|
19283|1.95|R|Breast localization stereo first lesion|
19284|0.98|R|Breast localization stereo each addl|
19285|1.66|R|Breast localization US first lesion|
19286|0.83|R|Breast localization US each addl|
19287|2.49|R|Breast localization MRI first lesion|
19288|1.25|R|Breast localization MRI each addl|
20206|0.97|R|Muscle biopsy percutaneous|
20220|1.61|R|Bone biopsy superficial|
20225|2.39|R|Bone biopsy deep|
20604|0.87|R|Small joint injection/aspiration w/ US|
20606|0.98|R|Intermediate joint injection/aspiration w/ US|
20611|1.07|R|Large joint injection/aspiration w/ US|
22510|7.7|R|Vertebroplasty cervicothoracic|
22511|7.15|R|Vertebroplasty lumbosacral|
22512|3.9|R|Vertebroplasty each addl|
22513|8.43|R|Kyphoplasty thoracic|
22514|7.79|R|Kyphoplasty lumbar|
22515|3.9|R|Kyphoplasty each addl|
27096|1.44|R|SI joint injection w/ imaging|
32408|3.1|R|Lung/mediastinum core biopsy w/ imaging|
32554|1.77|R|Thoracentesis w/o imaging|
32555|2.21|R|Thoracentesis w/ imaging|thora
32556|2.44|R|Pleural drain w/o imaging|
32557|3.04|R|Pleural drain w/ imaging|
36011|3.06|R|Selective venous catheter placement|
36221|3.82|R|Thoracic aortogram (arch) non-selective|
36222|5.15|R|Cerebral angio unilat common carotid|
36223|5.61|R|Cerebral angio unilat carotid w/ intracranial|
36224|6.09|R|Cerebral angio unilat internal carotid|
36225|5.61|R|Cerebral angio subclavian/vertebral|
36226|6.09|R|Cerebral angio vertebral w/ intracranial|
36245|4.53|R|Selective catheter abd/LE artery 1st order|
36246|4.89|R|Selective catheter abd/LE artery 2nd order|
36247|5.89|R|Selective catheter abd/LE artery 3rd+ order|
36556|1.71|R|Non-tunneled central line|
36558|4.48|R|Tunneled CV catheter (no port)|
36561|5.65|R|Port placement (chest)|port
36569|1.85|R|PICC w/o imaging|picc
36572|1.77|R|PICC w/ imaging <5 yr|picc
36573|1.66|R|PICC w/ imaging 5+ yr|picc
36581|3.15|R|Tunneled catheter exchange|
36589|2.22|R|Tunneled catheter removal|
36590|3.02|R|Port removal|
36901|3.28|R|Dialysis circuit fistulagram|
36902|4.71|R|Dialysis circuit w/ angioplasty|
36903|6.23|R|Dialysis circuit w/ stent|
36904|7.31|R|Dialysis circuit thrombectomy|
36905|8.78|R|Dialysis thrombectomy w/ angioplasty|
36906|10.16|R|Dialysis thrombectomy w/ stent|
37191|4.35|R|IVC filter placement|
37192|6.92|R|IVC filter repositioning|
37193|6.92|R|IVC filter retrieval|
37241|8.53|R|Embolization venous|
37242|9.56|R|Embolization arterial (non-hemorrhage)|
37243|11.45|R|Embolization organ/tumor|
37244|13.41|R|Embolization hemorrhage|
38505|1.55|R|Lymph node needle biopsy|
47000|1.61|R|Liver biopsy percutaneous|
47001|1.85|R|Liver biopsy w/ other major procedure|
47490|4.64|R|Percutaneous cholecystostomy|
47531|1.27|R|Cholangiogram existing access|
47532|4.14|R|Cholangiogram new access|
47533|5.25|R|Biliary drain external|
47534|7.41|R|Biliary drain internal-external|
47535|3.85|R|Biliary drain conversion ext to int-ext|
47536|2.54|R|Biliary drain exchange|
49082|1.21|R|Paracentesis w/o imaging|
49083|1.95|R|Paracentesis w/ imaging|para
49180|1.69|R|Abdominal/retroperitoneal mass biopsy|
49405|3.9|R|Drain visceral collection (abscess)|
49406|3.9|R|Drain peritoneal/retroperitoneal collection|
49407|4.14|R|Drain collection transrectal/transvaginal|
49440|3.83|R|Gastrostomy tube placement|
49441|4.41|R|Duodenal/jejunal tube placement|
49446|2.98|R|G-tube to GJ conversion|
49450|1.33|R|G-tube replacement|
49451|1.79|R|D/J tube replacement|
49452|2.79|R|GJ tube replacement|
49460|0.94|R|Tube obstruction clearance|
49465|0.6|R|Tube contrast check|
50200|2.32|R|Renal biopsy percutaneous|
50430|2.83|R|Nephrostogram new access|
50431|1.07|R|Nephrostogram existing access|
50432|3.9|R|Nephrostomy tube placement|
50433|4.92|R|Nephroureteral catheter placement|
50434|3.66|R|Nephrostomy to nephroureteral conversion|
50435|1.77|R|Nephrostomy tube exchange|
50693|3.86|R|Ureteral stent existing access|
50694|5.12|R|Ureteral stent new access|
50695|6.63|R|Ureteral stent new access w/ separate nephrostomy|
60100|1.52|R|Thyroid core biopsy|
62270|1.19|R|Lumbar puncture dx w/o imaging|lp
62272|1.54|R|Lumbar puncture therapeutic (drainage) w/o imaging|
62321|1.9|R|Epidural interlaminar cervical/thoracic w/ imaging|
62323|1.76|R|Epidural interlaminar lumbar/sacral w/ imaging|
62328|1.69|R|Lumbar puncture dx w/ fluoro/CT|lp
62329|1.98|R|Lumbar puncture therapeutic w/ fluoro/CT|
64479|2.23|R|TFESI cervical/thoracic 1 level|
64480|1.17|R|TFESI cervical/thoracic each addl|
64483|1.85|R|TFESI lumbar/sacral 1 level|
64484|0.98|R|TFESI lumbar/sacral each addl|
64490|1.77|R|Facet injection cervical/thoracic 1 level|
64493|1.48|R|Facet injection lumbar/sacral 1 level|
70010|1.16|F|Contrast x-ray of brain|
70015|1.16|F|Contrast x-ray of brain|
70030|0.18|X|XR orbits for foreign body|
70100|0.18|X|X-ray exam of jaw <4views|
70110|0.24|X|X-ray exam of jaw 4/> views|
70120|0.18|X|X-ray exam of mastoids|
70130|0.33|X|X-ray exam of mastoids|
70134|0.33|X|X-ray exam of middle ear|
70140|0.19|X|XR facial bones <3 views|
70150|0.25|X|XR facial bones 3+ views|
70160|0.17|X|XR nasal bones|
70170|0.29|F|X-ray exam of tear duct|
70190|0.2|X|X-ray exam of eye sockets|
70200|0.27|X|X-ray exam of eye sockets|
70210|0.17|X|XR sinuses <3 views|
70220|0.21|X|XR sinuses 3+ views|
70240|0.19|X|X-ray exam pituitary saddle|
70250|0.18|X|XR skull <4 views|
70260|0.27|X|XR skull 4+ views|
70300|0.1|X|X-ray exam of teeth|
70310|0.16|X|X-ray exam of teeth|
70320|0.21|X|Full mouth x-ray of teeth|
70328|0.18|X|X-ray exam of jaw joint|
70330|0.23|X|X-ray exam of jaw joints|
70332|0.53|F|X-ray exam of jaw joint|
70336|1.44|M|MRI TMJ|
70350|0.17|X|X-ray head for orthodontia|
70355|0.2|X|XR panorex|
70360|0.18|X|XR soft tissue neck|
70370|0.31|F|Throat x-ray & fluoroscopy|
70371|0.82|F|Speech evaluation complex|
70380|0.17|F|X-ray exam of salivary gland|
70390|0.37|F|X-ray exam of salivary duct|
70450|0.83|C|CT head w/o|noncon head ncct wo
70460|1.1|C|CT head w/|w
70470|1.24|C|CT head w/o & w/|wwo
70471|2.5|C|CTA head & neck w/ noncontrast|wwo
70472|0.77|C|CT cerebral perfusion w/ CT/CTA|w
70473|1|C|CT cerebral perfusion w/o CT/CTA|wo
70480|1.25|C|CT orbit/temporal bone w/o|wo
70481|1.1|C|CT orbit/temporal bone w/|w
70482|1.24|C|CT orbit/temporal bone w/o & w/|wwo
70486|0.83|C|CT maxillofacial/sinus w/o|wo
70487|1.1|C|CT maxillofacial/sinus w/|w
70488|1.24|C|CT maxillofacial/sinus w/o & w/|wwo
70490|1.25|C|CT soft tissue neck w/o|wo
70491|1.35|C|CT soft tissue neck w/|w
70492|1.58|C|CT soft tissue neck w/o & w/|wwo
70496|1.71|C|CTA head|
70498|1.71|C|CTA neck|
70540|1.32|M|MRI orbit/face/neck w/o|wo
70542|1.58|M|MRI orbit/face/neck w/|w
70543|2.1|M|MRI orbit/face/neck w/o & w/|wwo
70544|1.17|M|MRA head w/o|wo
70545|1.17|M|MRA head w/|w
70546|1.44|M|MRA head w/o & w/|wwo
70547|1.17|M|MRA neck w/o|wo
70548|1.46|M|MRA neck w/|w
70549|1.76|M|MRA neck w/o & w/|wwo
70551|1.44|M|MRI brain w/o|wo
70552|1.74|M|MRI brain w/|w
70553|2.23|M|MRI brain w/o & w/|wwo
70554|2.06|M|fMRI brain (tech administered)|
70555|2.48|M|fMRI brain (physician administered)|
70557|2.83|M|MRI brain intraop w/o|wo
70558|3.12|M|MRI brain intraop w/|w
70559|3.12|M|MRI brain intraop w/o & w/|wwo
71045|0.18|X|XR chest 1 view|cxr
71046|0.21|X|XR chest 2 views|cxr
71047|0.26|X|XR chest 3 views|cxr
71048|0.3|X|XR chest 4+ views|cxr
71100|0.21|X|XR ribs unilat 2 views|
71101|0.26|X|XR ribs unilat w/ chest 3+ views|
71110|0.28|X|XR ribs bilat 3 views|
71111|0.31|X|XR ribs bilat w/ chest 4+ views|
71120|0.2|X|X-ray exam breastbone 2/>vws|
71130|0.21|X|X-ray strenoclavic jt 3/>vws|
71250|1.05|C|CT chest w/o|wo
71260|1.13|C|CT chest w/|w
71270|1.22|C|CT chest w/o & w/|wwo
71271|1.05|C|CT chest low-dose lung cancer screening|ldct lcs wo
71275|1.77|C|CTA chest (PE)|pe study pulmonary embolism
71550|1.42|M|MRI chest w/o|wo
71551|1.69|M|MRI chest w/|w
71552|2.2|M|MRI chest w/o & w/|wwo
71555|1.76|M|MRA chest|wwo
72020|0.16|X|XR spine 1 view|
72040|0.21|X|XR c-spine 2-3 views|
72050|0.26|X|XR c-spine 4-5 views|
72052|0.29|X|XR c-spine 6+ views|
72070|0.2|X|XR t-spine 2 views|
72072|0.22|X|XR t-spine 3 views|
72074|0.24|X|XR t-spine 4+ views|
72080|0.2|X|XR thoracolumbar 2+ views|
72081|0.25|X|XR entire spine (scoliosis) 1 view|
72082|0.3|X|XR entire spine 2-3 views|
72083|0.34|X|XR entire spine 4-5 views|
72084|0.4|X|XR entire spine 6+ views|
72100|0.21|X|XR l-spine 2-3 views|
72110|0.25|X|XR l-spine 4+ views|
72114|0.29|X|XR l-spine with bending|
72120|0.21|X|XR l-spine bending only|
72125|0.98|C|CT c-spine w/o|wo
72126|1.19|C|CT c-spine w/|w
72127|1.24|C|CT c-spine w/o & w/|wwo
72128|0.98|C|CT t-spine w/o|wo
72129|1.19|C|CT t-spine w/|w
72130|1.24|C|CT t-spine w/o & w/|wwo
72131|0.98|C|CT l-spine w/o|wo
72132|1.19|C|CT l-spine w/|w
72133|1.24|C|CT l-spine w/o & w/|wwo
72141|1.44|M|MRI c-spine w/o|wo
72142|1.74|M|MRI c-spine w/|w
72146|1.44|M|MRI t-spine w/o|wo
72147|1.74|M|MRI t-spine w/|w
72148|1.44|M|MRI l-spine w/o|wo
72149|1.74|M|MRI l-spine w/|w
72156|2.23|M|MRI c-spine w/o & w/|wwo
72157|2.23|M|MRI t-spine w/o & w/|wwo
72158|2.23|M|MRI l-spine w/o & w/|wwo
72159|1.76|M|MRA spine|wwo
72170|0.17|X|XR pelvis 1-2 views|
72190|0.24|X|XR pelvis 3+ views|
72191|1.76|C|CTA pelvis|wwo
72192|1.06|C|CT pelvis w/o|wo
72193|1.13|C|CT pelvis w/|w
72194|1.19|C|CT pelvis w/o & w/|wwo
72195|1.42|M|MRI pelvis w/o|wo
72196|1.69|M|MRI pelvis w/|w
72197|2.15|M|MRI pelvis w/o & w/|wwo
72198|1.76|M|MRA pelvis|wwo
72200|0.17|X|XR SI joints <3 views|
72202|0.22|X|XR SI joints 3+ views|
72220|0.17|X|XR sacrum/coccyx|
72240|0.89|F|Myelogram cervical|
72255|0.89|F|Myelogram thoracic|
72265|0.81|F|Myelogram lumbar|
72270|1.3|F|Myelogram 2+ regions|
72285|1.13|F|Discography cerv/thor spine|
72295|0.81|F|X-ray of lower spine disk|
73000|0.16|X|XR clavicle|
73010|0.17|X|XR scapula|
73020|0.15|X|XR shoulder 1 view|
73030|0.18|X|XR shoulder 2+ views|
73040|0.53|F|Arthrogram shoulder|
73050|0.18|X|XR AC joints bilateral|
73060|0.16|X|XR humerus|
73070|0.16|X|XR elbow 2 views|
73080|0.17|X|XR elbow 3+ views|
73085|0.53|F|Arthrogram elbow|
73090|0.16|X|XR forearm|
73092|0.16|X|X-ray exam of arm infant|
73100|0.16|X|XR wrist 2 views|
73110|0.17|X|XR wrist 3+ views|
73115|0.53|F|Arthrogram wrist|
73120|0.16|X|XR hand 2 views|
73130|0.17|X|XR hand 3+ views|
73140|0.13|X|XR finger(s)|
73200|0.98|C|CT upper extremity w/o|wo
73201|1.13|C|CT upper extremity w/|w
73202|1.19|C|CT upper extremity w/o & w/|wwo
73206|1.76|C|CTA upper extremity|wwo
73218|1.32|M|MRI upper ext (non-joint) w/o|wo
73219|1.58|M|MRI upper ext (non-joint) w/|w
73220|2.1|M|MRI upper ext (non-joint) w/o & w/|wwo
73221|1.32|M|MRI upper ext joint (shoulder/elbow/wrist) w/o|wo
73222|1.58|M|MRI upper ext joint w/|shoulder elbow wrist w
73223|2.1|M|MRI upper ext joint w/o & w/|shoulder elbow wrist wwo
73225|1.69|M|MRA upper extremity|wwo
73501|0.18|X|XR hip unilat 1 view|
73502|0.21|X|XR hip unilat 2-3 views|
73503|0.26|X|XR hip unilat 4+ views|
73521|0.21|X|XR hips bilat 2 views|
73522|0.28|X|XR hips bilat 3-4 views|
73523|0.3|X|XR hips bilat 5+ views|
73525|0.53|F|Arthrogram hip|
73551|0.16|X|XR femur 1 view|
73552|0.18|X|XR femur 2+ views|
73560|0.16|X|XR knee 1-2 views|
73562|0.18|X|XR knee 3 views|
73564|0.21|X|XR knee 4+ views|
73565|0.16|X|XR knees bilat standing|
73580|0.58|F|Arthrogram knee|
73590|0.16|X|XR tib/fib|
73592|0.16|X|X-ray exam of leg infant|
73600|0.16|X|XR ankle 2 views|
73610|0.17|X|XR ankle 3+ views|
73615|0.53|F|Arthrogram ankle|
73620|0.16|X|XR foot 2 views|
73630|0.17|X|XR foot 3+ views|
73650|0.16|X|XR calcaneus|
73660|0.13|X|XR toe(s)|
73700|0.98|C|CT lower extremity w/o|wo
73701|1.13|C|CT lower extremity w/|w
73702|1.19|C|CT lower extremity w/o & w/|wwo
73706|1.85|C|CTA lower extremity|wwo
73718|1.32|M|MRI lower ext (non-joint) w/o|wo
73719|1.58|M|MRI lower ext (non-joint) w/|w
73720|2.1|M|MRI lower ext (non-joint) w/o & w/|wwo
73721|1.32|M|MRI lower ext joint (hip/knee/ankle) w/o|wo
73722|1.58|M|MRI lower ext joint w/|hip knee ankle w
73723|2.1|M|MRI lower ext joint w/o & w/|hip knee ankle wwo
73725|1.77|M|MRA lower extremity|wwo
74018|0.18|X|XR abdomen 1 view (KUB)|
74019|0.22|X|XR abdomen 2 views|
74021|0.26|X|XR abdomen 3+ views|
74022|0.31|X|XR acute abdomen series|
74150|1.16|C|CT abdomen w/o|wo
74160|1.24|C|CT abdomen w/|w
74170|1.37|C|CT abdomen w/o & w/|wwo
74174|2.15|C|CTA abdomen & pelvis|w
74175|1.77|C|CTA abdomen|w
74176|1.7|C|CT abd & pelvis w/o|ap abdpel stone kidney renal wo
74177|1.77|C|CT abd & pelvis w/|ap abdpel w
74178|1.96|C|CT abd & pelvis w/o & w/|ap abdpel wwo
74181|1.42|M|MRI abdomen w/o|wo
74182|1.69|M|MRI abdomen w/|w
74183|2.15|M|MRI abdomen w/o & w/|wwo
74185|1.76|M|MRA abdomen|wwo
74190|0.47|X|Peritoneogram rs&i|
74210|0.58|F|Pharynx/cervical esophagus contrast|
74220|0.59|F|Esophagram single contrast|
74221|0.68|F|Esophagram double contrast|
74230|0.52|F|Modified barium swallow (speech)|mbs speech
74235|1.16|F|Remove esophagus obstruction|
74240|0.78|F|Upper GI single contrast|
74246|0.88|F|Upper GI double contrast|
74248|0.68|F|Small bowel follow-through add-on|
74250|0.79|F|Small bowel series single contrast|
74251|1.14|F|Small bowel series double contrast|
74261|2.34|C|CT colonography dx w/o|wo
74262|2.44|C|CT colonography dx w/|w
74263|2.22|C|CT colonography screening|
74270|1.01|F|Barium enema single contrast|
74280|1.23|F|Barium enema double contrast|
74283|1.97|F|Therapeutic enema (intussusception reduction)|
74290|0.31|F|Contrast x-ray gallbladder|
74300|0.26|F|Intraop cholangiogram|
74301|0.2|F|X-rays at surgery add-on|
74328|0.46|F|ERCP bile duct imaging|
74329|0.46|F|ERCP pancreatic duct imaging|
74330|0.55|F|ERCP bile & pancreatic imaging|
74340|0.53|F|Fluoro guidance GI tube|
74355|0.74|F|X-ray guide intestinal tube|
74360|0.53|F|X-ray guide gi dilation|
74363|0.86|F|X-ray bile duct dilation|
74400|0.48|F|IV urography|
74410|0.48|F|Urography nfs drip&/bolus|
74415|0.48|F|Urography nfs drip&/bls w/nf|
74420|0.51|F|Retrograde urography|
74425|0.5|F|Antegrade urography|
74430|0.31|F|Cystogram|
74440|0.37|F|X-ray male genital tract|
74445|1.11|F|X-ray exam of penis|
74450|0.32|F|Retrograde urethrocystography|
74455|0.32|F|Voiding cystourethrogram (VCUG)|vcug
74470|0.53|F|X-ray exam of kidney lesion|
74485|0.81|F|Dilation urtr/urt rs&i|
74712|2.93|M|MRI fetal single/first gestation|
74713|1.8|M|MRI fetal each addl gestation|
74740|0.37|F|Hysterosalpingogram (HSG)|
74742|0.59|F|X-ray fallopian tube|
74775|0.6|F|X-ray exam of perineum|
75557|2.29|M|MRI cardiac morphology w/o|wo
75559|2.88|M|MRI cardiac stress w/o|wo
75561|2.54|M|MRI cardiac morphology w/o & w/|wwo
75563|2.93|M|MRI cardiac stress w/o & w/|wwo
75565|0.24|M|MRI cardiac velocity flow mapping add-on|
75571|0.57|C|CT heart calcium score|cac calcium wo
75572|1.71|C|CT heart structure w/ 3D|w
75573|2.49|C|CT heart congenital w/ 3D|w
75574|2.34|C|CTA coronary (CCTA) w/ 3D|ccta coronary w
75577|0.85|C|Quan&char c athrosclrtc plaq|
75580|0.73|C|N-invas est c ffr sw aly cta|
75600|0.48|I|Contrast exam thoracic aorta|
75605|1.11|I|Contrast exam thoracic aorta|
75625|1.4|I|Contrast exam abdominl aorta|
75630|1.95|I|X-ray aorta leg arteries|
75635|2.34|C|CTA abdominal aorta & bilat runoff|
75705|2.13|I|Artery x-rays spine|
75710|1.71|I|Artery x-rays arm/leg|
75716|1.92|I|Artery x-rays arms/legs|
75726|2|I|Artery x-rays abdomen|
75731|1.11|I|Artery x-rays adrenal gland|
75733|1.28|I|Artery x-rays adrenals|
75736|1.11|I|Artery x-rays pelvis|
75741|1.28|I|Artery x-rays lung|
75743|1.62|I|Artery x-rays lungs|
75746|1.11|I|Artery x-rays lung|
75756|1.11|I|Artery x-rays chest|
75774|0.98|I|Artery x-ray each vessel|
75801|0.79|I|Lymph vessel x-ray arm/leg|
75803|1.14|I|Lymph vessel x-ray arms/legs|
75805|0.79|I|Lymph vessel x-ray trunk|
75807|1.14|I|Lymph vessel x-ray trunk|
75809|0.46|I|Nonvascular shunt x-ray|
75810|1.11|I|Vein x-ray spleen/liver|
75820|1.02|I|Vein x-ray arm/leg|
75822|1.44|I|Vein x-ray arms/legs|
75825|1.11|I|Vein x-ray trunk|
75827|1.11|I|Vein x-ray chest|
75831|1.11|I|Vein x-ray kidney|
75833|1.45|I|Vein x-ray kidneys|
75840|1.11|I|Vein x-ray adrenal gland|
75860|1.11|I|Vein x-ray neck|
75870|1.11|I|Vein x-ray skull|
75872|1.11|I|Vein x-ray skull epidural|
75880|0.68|I|Vein x-ray eye socket|
75885|1.4|I|Vein x-ray liver w/hemodynam|
75887|1.4|I|Vein x-ray liver w/o hemodyn|
75889|1.11|I|Vein x-ray liver w/hemodynam|
75891|1.11|I|Vein x-ray liver|
75893|0.53|I|Venous sampling by catheter|
75894|2.19|I|X-rays transcath therapy|
75898|1.8|I|Follow-up angiography|
75901|0.48|I|Remove cva device obstruct|
75902|0.38|I|Remove cva lumen obstruct|
75970|0.81|I|Vascular biopsy|
75984|0.81|I|Catheter change w/ contrast|
75989|1.16|I|Imaging guidance abscess drainage|
76000|0.3|F|Fluoroscopy <1 hr (physician)|
76010|0.18|F|XR nose to rectum (foreign body, child)|
76016|0.59|M|Mr safety deter phys/qhp|
76017|0.74|M|Mr sfty med physics xm cstmz|
76018|0.73|M|Mr safety implant elec prepj|
76019|0.59|M|Mr safety implt pos&/immoblj|
76080|0.53|F|X-ray exam of fistula|
76098|0.3|F|X-ray exam surgical specimen|
76100|0.57|F|X-ray exam of body section|
76120|0.37|F|Cine/video x-rays|
76125|0.26|F|Cine/video x-rays add-on|
76376|0.2|X|3D rendering (no separate workstation)|
76377|0.77|X|3D rendering (separate workstation)|
76380|0.96|C|CT limited/follow-up study|
76391|1.07|M|MR elastography|
76506|0.61|U|US head (neonatal)|
76510|0.68|U|Oph us dx b-scan&quan a-scan|
76511|0.62|U|Oph us dx quan a-scan only|
76512|0.55|U|Oph us dx b-scan|
76513|0.59|U|Oph us dx ant sgm us uni/bi|
76514|0.14|U|Echo exam of eye thickness|
76516|0.39|U|Echo exam of eye|
76519|0.53|U|Echo exam of eye|
76529|0.56|U|Echo exam of eye|
76536|0.55|U|US head & neck soft tissue (thyroid)|thyroid
76604|0.58|U|US chest|
76641|0.71|U|US breast complete|
76642|0.66|U|US breast limited|
76700|0.79|U|US abdomen complete|
76705|0.58|U|US abdomen limited (RUQ)|ruq gallbladder
76706|0.54|U|US AAA screening|
76770|0.72|U|US retroperitoneal/renal complete|
76775|0.57|U|US retroperitoneal/renal limited|
76776|0.74|U|US renal transplant w/ Doppler|
76800|1.1|U|US spinal canal|
76801|0.97|U|US OB <14 wks single|
76802|0.81|U|US OB <14 wks each addl fetus|
76805|0.97|U|US OB >=14 wks single|
76810|0.96|U|US OB >=14 wks each addl fetus|
76811|1.85|U|US OB detailed anatomy single|
76812|1.74|U|US OB detailed each addl fetus|
76813|1.15|U|US OB nuchal translucency|
76814|0.97|U|US OB nuchal each addl|
76815|0.63|U|US OB limited|
76816|0.83|U|US OB follow-up|
76817|0.73|U|US OB transvaginal|
76818|1.02|U|Biophysical profile w/ NST|
76819|0.75|U|Biophysical profile w/o NST|
76820|0.49|U|US umbilical artery Doppler|
76821|0.68|U|US middle cerebral artery Doppler|
76825|1.63|U|Fetal echo|
76826|0.81|U|Fetal echo follow-up|
76827|0.57|U|Fetal Doppler echo complete|
76828|0.55|U|Fetal Doppler echo follow-up|
76830|0.67|U|US transvaginal non-OB|tv tvus endovaginal
76831|0.7|U|US sonohysterography|
76856|0.67|U|US pelvis complete (transabdominal)|ta
76857|0.49|U|US pelvis limited|
76870|0.62|U|US scrotum|
76872|0.65|U|US transrectal|
76873|1.51|U|US prostate volume study|
76881|0.88|U|US joint complete|
76882|0.67|U|US joint/extremity limited|
76883|1.18|U|US nerve complete 1 extremity|
76885|0.72|U|US infant hips dynamic|
76886|0.6|U|US infant hips static|
76932|0.65|U|Echo guide for heart biopsy|
76936|1.94|U|Echo guide for artery repair|
76937|0.29|U|US guidance vascular access|picc line
76940|1.95|U|US guidance tissue ablation|
76941|1.31|U|Echo guide for transfusion|
76942|0.65|U|US guidance needle placement (biopsy)|bx biopsy
76945|0.65|U|Echo guide villus sampling|
76946|0.37|U|Echo guide for amniocentesis|
76948|0.65|U|Echo guide ova aspiration|
76965|1.31|U|Echo guidance radiotherapy|
76975|0.79|U|Gi endoscopic ultrasound|
76977|0.05|U|US bone density|
76978|1.58|U|Contrast US (CEUS) first lesion|
76979|0.83|U|Contrast US (CEUS) each addl lesion|
76981|0.58|U|US elastography parenchyma|
76982|0.58|U|US elastography first lesion|
76983|0.46|U|US elastography each addl lesion|
76984|0.59|U|Dx intraop thoracic aorta us|
76987|1.85|U|Dx intraop epicar car us chd|
76988|1.17|U|Dx ntrop epcr us chd img acq|
76989|0.68|U|Dx intraop epcar us chd i&r|
76998|0.89|U|US guidance intraoperative|
77001|0.37|F|Fluoro guidance central venous device|
77002|0.53|F|Fluoro guidance needle placement|
77003|0.59|F|Fluoro guidance spine injection|
77011|1.18|C|CT guidance for localization|
77012|1.46|C|CT guidance for needle placement|
77013|3.89|C|CT guidance for tissue ablation|
77021|1.46|M|MRI guidance needle placement|
77022|4.13|M|MRI guidance tissue ablation|
77046|1.41|B|MRI breast unilat w/o|wo
77047|1.56|B|MRI breast bilat w/o|wo
77048|2.05|B|MRI breast unilat w/o & w/|wwo
77049|2.24|B|MRI breast bilat w/o & w/|wwo
77053|0.35|B|Galactogram single duct|
77054|0.44|B|Galactogram multiple ducts|
77063|0.59|B|Breast tomosynthesis screening add-on (DBT)|3d tomo dbt
77065|0.79|B|Mammo diagnostic unilat|
77066|0.98|B|Mammo diagnostic bilat|
77067|0.74|B|Mammo screening bilat|screening mammogram
77071|0.4|D|Mnl appl strs jt radiography|
77072|0.19|X|XR bone age|
77073|0.25|X|Bone length studies|
77074|0.43|X|XR skeletal survey limited|
77075|0.54|X|XR skeletal survey complete|
77076|0.68|X|XR skeletal survey infant|
77077|0.32|X|Joint survey single view|
77078|0.24|C|CT bone density axial|
77080|0.2|D|DXA axial (hip/spine)|
77081|0.2|D|DXA appendicular|
77084|1.56|M|MRI bone marrow|
77085|0.29|D|DXA axial w/ vertebral fracture assessment|
77086|0.17|D|Vertebral fracture assessment (DXA)|
77089|0.2|D|Tbs dxa cal w/i&r fx risk|
77092|0.2|D|Tbs i&r fx rsk qhp|
78012|0.19|N|Thyroid uptake|
78013|0.36|N|Thyroid scan|
78014|0.49|N|Thyroid scan w/ uptake|
78015|0.65|N|Thyroid met imaging|
78016|0.8|N|Thyroid met imaging/studies|
78018|0.84|N|Thyroid met imaging body|
78020|0.59|N|Thyroid met uptake|
78070|0.78|N|Parathyroid scan planar|
78071|1.17|N|Parathyroid planar w/ SPECT|
78072|1.56|N|Parathyroid planar w/ SPECT/CT|
78075|0.72|N|Adrenal cortex & medulla img|
78102|0.54|N|Bone marrow imaging ltd|
78103|0.73|N|Bone marrow imaging mult|
78104|0.78|N|Bone marrow imaging body|
78110|0.19|N|Plasma volume single|
78111|0.21|N|Plasma volume multiple|
78120|0.22|N|Red cell mass single|
78121|0.31|N|Red cell mass multiple|
78122|0.44|N|Whl bld volume determination|
78130|0.59|N|Red cell survival study|
78140|0.59|N|Red cell sequestration|
78185|0.39|N|Spleen imaging|
78191|0.59|N|Platelet survival study|
78195|1.17|N|Lymphoscintigraphy|
78201|0.43|N|Liver imaging static only|
78202|0.5|N|Liver imaging with vasc flow|
78215|0.48|N|Lvr&spleen img static only|
78216|0.56|N|Lvr&spleen img w/vasc flow|
78226|0.72|N|HIDA scan|
78227|0.88|N|HIDA scan w/ drug (CCK)|
78230|0.44|N|Salivary gland imaging|
78231|0.51|N|Salivary glnd img serial img|
78232|0.46|N|Salivary gland function std|
78258|0.72|N|Esophageal motility|
78261|0.67|N|Gastric mucosa imaging|
78262|0.66|N|Gastroesophageal reflux std|
78264|0.77|N|Gastric emptying|
78265|0.96|N|Gstr emptg img sm bwl trnst|
78266|1.05|N|Gstr empt img sm bwl&colon|
78278|0.97|N|GI bleed scan|
78282|0.37|N|Gi protein loss|
78290|0.66|N|Intestine imaging|
78291|0.86|N|Pertl-ven shunt patency test|
78300|0.6|N|Bone scan limited|
78305|0.81|N|Bone scan multiple areas|
78306|0.84|N|Bone scan whole body|
78315|0.99|N|Bone scan 3-phase|
78414|0.44|N|Non-imaging heart function|
78428|0.76|N|Cardiac shunt imaging|
78429|1.72|P|Myocrd img pet 1 std w/ct|
78430|1.63|P|Myocrd img pet rst/strs w/ct|
78431|1.85|P|Cardiac PET rest & stress w/ CT|
78432|2.02|P|Myocrd img pet 2rtracer|
78433|2.2|P|Myocrd img pet 2rtracer ct|
78434|0.61|P|Aqmbf pet rest & rx stress|
78445|0.48|N|Vascular flow imaging|
78451|1.35|N|Myocardial perfusion SPECT single|
78452|1.58|N|Myocardial perfusion SPECT multiple (rest/stress)|
78453|0.98|N|Ht muscle image planar sing|
78454|1.31|N|Ht musc image planar mult|
78456|0.98|N|Acute venous thrombus image|
78457|0.75|N|Venous thrombosis imaging|
78458|0.88|N|Ven thrombosis images bilat|
78459|1.57|P|Myocrd img pet single study|
78466|0.67|N|Heart infarct image|
78468|0.78|N|Heart infarct image (ef)|
78469|0.9|N|Heart infarct image (3d)|
78472|0.96|N|MUGA single|
78473|1.43|N|Gated heart multiple|
78481|0.96|N|Heart first pass single|
78483|1.43|N|Heart first pass multiple|
78491|1.52|P|Cardiac PET single rest or stress|
78492|1.76|P|Cardiac PET rest & stress|
78494|1.16|N|Heart image spect|
78496|0.49|N|Heart first pass add-on|
78579|0.48|N|Lung ventilation scan|
78580|0.72|N|Lung perfusion scan|
78582|1.04|N|V/Q scan|vq
78597|0.73|N|Lung perfusion differential|
78598|0.83|N|Lung perf&ventilat diferentl|
78600|0.43|N|Brain image < 4 views|
78601|0.5|N|Brain image w/flow < 4 views|
78605|0.52|N|Brain image 4+ views|
78606|0.62|N|Brain image w/flow 4 + views|
78608|1.46|P|Brain PET metabolic|
78610|0.29|N|Brain flow imaging only|
78630|0.66|N|Cerebrospinal fluid scan|
78635|0.59|N|Csf ventriculography|
78645|0.56|N|Csf shunt evaluation|
78650|0.59|N|Csf leakage imaging|
78660|0.52|N|Nuclear exam of tear flow|
78700|0.44|N|Kidney imaging morphol|
78701|0.48|N|Kidney imaging with flow|
78707|0.94|N|Renal scan w/o drug|
78708|1.18|N|Renal scan w/ drug (Lasix)|
78709|1.37|N|K flow/funct image multiple|
78725|0.37|N|Kidney function study|
78730|0.15|N|Urinary bladder retention|
78740|0.56|N|Ureteral reflux study|
78761|0.69|N|Testicular imaging w/flow|
78800|0.62|N|Rp loclzj tum 1 area 1 d img|
78801|0.71|N|Rp loclzj tum 2+area 1+d img|
78802|0.78|N|Tumor whole body 1 day|
78803|1.06|N|Tumor/infection SPECT 1 area|
78804|0.98|N|Rp loclzj tum whbdy 2+d img|
78808|0.18|N|Iv inj ra drug dx study|
78811|1.5|P|PET limited area|
78812|1.88|P|PET skull to thigh|
78813|1.95|P|PET whole body|
78814|2.15|P|PET/CT limited area|
78815|2.38|P|PET/CT skull base to mid-thigh|fdg pet
78816|2.44|P|PET/CT whole body|
78830|1.45|N|Tumor SPECT/CT 1 area|
78831|1.77|N|Rp loclzj tum spect 2 areas|
78832|2.07|N|Tumor SPECT/CT 2+ areas|
78835|0.46|N|Rp quan meas single area|
79005|1.76|N|Nuclear rx oral admin|
79101|1.91|N|Nuclear rx iv admin|
79200|1.94|N|Nuclear rx intracav admin|
79300|1.56|N|Nuclr rx interstit colloid|
79403|2.19|N|Hematopoietic nuclear tx|
79440|1.94|N|Nuclear rx intra-articular|
79445|2.34|N|Nuclear rx intra-arterial|
93880|0.78|U|US carotid duplex bilateral|carotid
93882|0.49|U|US carotid duplex unilat/limited|
93886|0.88|U|Transcranial Doppler complete|
93888|0.71|U|Transcranial Doppler limited|
93892|1.12|U|Tcd emboli detect w/o inj|
93893|1.12|U|Tcd std icr art ven-art shnt|
93896|0.79|U|Vsrctv std tcd icr art compl|
93897|0.71|U|Emboli detcj wo iv mbubb njx|
93898|0.83|U|Ven-artl shunt det mbubb njx|
93922|0.24|U|ABI/arterial limited 1-2 levels|
93923|0.44|U|Arterial physiologic 3+ levels|
93924|0.49|U|Arterial treadmill study|
93925|0.78|U|US arterial duplex lower ext bilat|
93926|0.49|U|US arterial duplex lower ext unilat|
93930|0.78|U|US arterial duplex upper ext bilat|
93931|0.49|U|US arterial duplex upper ext unilat|
93970|0.68|U|US venous duplex extremity bilat (DVT)|dvt
93971|0.44|U|US venous duplex extremity unilat (DVT)|dvt
93975|1.13|U|US duplex abd/pelvis/scrotum/retroperitoneal complete|
93976|0.78|U|US duplex abd/pelvis/scrotum limited|
93978|0.78|U|US duplex aorta/IVC/iliac complete|
93979|0.49|U|US duplex aorta/IVC/iliac limited|
93980|1.22|U|US penile duplex complete|
93981|0.43|U|US penile duplex follow-up|
93985|0.78|U|US duplex hemodialysis access bilat|
93986|0.49|U|US duplex hemodialysis access unilat|
93990|0.49|U|US duplex dialysis access flow|
G0279|0.59|B|Breast tomosynthesis diagnostic add-on (DBT)|3d tomo dbt`;
