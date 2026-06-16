import React, { createContext, useContext, useState, useCallback } from "react";

export type Stage = "New Leads" | "Contacted" | "Proposal Sent" | "Negotiation" | "Converted" | "Lost";
export type LeadSource = "Website" | "Referral" | "LinkedIn" | "Google Ads";
export type View = "Dashboard" | "Leads" | "Clients" | "Tasks" | "Calendar" | "Reports" | "Settings";
export type ActivityIcon = "file" | "phone" | "check" | "clipboard" | "sign" | "user" | "move" | "task";

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  source: LeadSource;
  stage: Stage;
  createdAt: Date;
}

export interface Client {
  id: string;
  name: string;
  domain: string;
  project: string;
  value: string;
  valueNum: number;
  monthlyValue: number;
  status: "Active" | "Waiting" | "At Risk";
  avatar: string;
}

export interface Task {
  id: string;
  title: string;
  assignee: string;
  dueDate: string;
  status: "pending" | "completed" | "overdue";
  priority: "high" | "medium" | "low";
  client: string;
}

export interface Activity {
  id: string;
  iconType: ActivityIcon;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle: string;
  time: string;
  timestamp: Date;
}

export interface Followup {
  id: string;
  company: string;
  contact: string;
  when: string;
  whenLabel: string;
  type: "call" | "meeting";
  tag: string;
  tagColor: string;
  tagBg: string;
  completed: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "lead" | "task" | "client" | "system";
}

// 47 offset: historical leads tracked before this system
const HISTORICAL_LEAD_OFFSET = 47;

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

function makeLead(
  name: string, company: string, email: string, phone: string,
  source: LeadSource, stage: Stage, daysAgo = 0
): Lead {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return { id: makeId(), name, company, email, phone, source, stage, createdAt: d };
}

const INITIAL_LEADS: Lead[] = [
  // New Leads (24)
  makeLead("Krish Mehta","TechFlow Solutions","krish@techflow.in","9876543210","Website","New Leads",1),
  makeLead("Sneha Joshi","DesignCraft","sneha@designcraft.in","9812345678","LinkedIn","New Leads",1),
  makeLead("Rahul Kapoor","InnoWeb","rahul@innoweb.co","9867432100","Referral","New Leads",2),
  makeLead("Pooja Sharma","BrandMakers","pooja@brandmakers.in","9845621300","Google Ads","New Leads",2),
  makeLead("Aditya Kumar","CodeBase IO","aditya@codebase.io","9856743200","Website","New Leads",3),
  makeLead("Neha Patel","StartupHub","neha@startuphub.in","9823456100","LinkedIn","New Leads",3),
  makeLead("Vikrant Singh","WebSphere","vikrant@websphere.co","9876123400","Referral","New Leads",4),
  makeLead("Riya Gupta","PixelNation","riya@pixelnation.in","9812643500","Website","New Leads",4),
  makeLead("Arjun Reddy","TechPioneer","arjun@techpioneer.in","9845713600","Google Ads","New Leads",5),
  makeLead("Deepika Nair","DigiMark","deepika@digimark.co","9867234100","LinkedIn","New Leads",5),
  makeLead("Siddharth Jain","AppForge","siddharth@appforge.in","9856412300","Referral","New Leads",6),
  makeLead("Priya Malhotra","CloudNine","priya@cloudnine.co","9823145600","Website","New Leads",6),
  makeLead("Rohit Verma","DesignHub","rohit@designhub.in","9876234500","Google Ads","New Leads",7),
  makeLead("Ananya Singh","WebMatrix","ananya@webmatrix.co","9812534600","LinkedIn","New Leads",7),
  makeLead("Karthik Rao","TechSpark","karthik@techspark.in","9845623100","Referral","New Leads",8),
  makeLead("Meena Iyer","BrandLab","meena@brandlab.in","9867312400","Website","New Leads",8),
  makeLead("Suresh Pillai","CodeNation","suresh@codenation.co","9856231400","Google Ads","New Leads",9),
  makeLead("Kavya Menon","AppDev Pro","kavya@appdevpro.in","9823412300","LinkedIn","New Leads",9),
  makeLead("Amit Tiwari","WebCraft India","amit@webcraft.in","9876412300","Website","New Leads",10),
  makeLead("Shreya Desai","TechSuite","shreya@techsuite.co","9812723400","Referral","New Leads",10),
  makeLead("Varun Bhatia","DigitalSpark","varun@digitalspark.in","9845234600","Google Ads","New Leads",11),
  makeLead("Nisha Agarwal","BrandForge","nisha@brandforge.in","9867143200","LinkedIn","New Leads",11),
  makeLead("Pranav Mishra","CodeLab","pranav@codelab.co","9856312400","Website","New Leads",12),
  makeLead("Divya Chawla","AppNation","divya@appnation.in","9823531400","Referral","New Leads",12),
  // Contacted (18)
  makeLead("Arjun Sharma","TechNova Inc.","arjun@technova.in","9876543000","Website","Contacted",14),
  makeLead("Priya Roy","GreenLeaf Co.","priya@greenleaf.co","9812345000","Referral","Contacted",15),
  makeLead("Vijay Kumar","BlueSky Ltd.","vijay@bluesky.co","9867432000","LinkedIn","Contacted",16),
  makeLead("Sana Sheikh","InnoVate Tech","sana@innovate.in","9845621000","Google Ads","Contacted",17),
  makeLead("Raj Patel","PixelPro","raj@pixelpro.in","9856743000","Website","Contacted",18),
  makeLead("Leena Thomas","Digital First","leena@digitalfirst.co","9823456000","LinkedIn","Contacted",19),
  makeLead("Dev Sharma","WebCraft","dev@webcraft.in","9876123000","Referral","Contacted",20),
  makeLead("Maya Kapoor","NextGen Solutions","maya@nextgen.co","9812643000","Website","Contacted",21),
  makeLead("Chirag Modi","BrandBoost","chirag@brandboost.in","9845713000","Google Ads","Contacted",22),
  makeLead("Anita Nair","CreativeHub","anita@creativehub.co","9867234000","LinkedIn","Contacted",23),
  makeLead("Rajan Reddy","SwiftApps","rajan@swiftapps.in","9856412000","Referral","Contacted",24),
  makeLead("Tara Gupta","EcoVentures","tara@ecoventures.co","9823145000","Website","Contacted",25),
  makeLead("Arun Das","TechPulse","arun@techpulse.in","9876234000","Google Ads","Contacted",26),
  makeLead("Shirin Ali","MarketEdge","shirin@marketedge.co","9812534000","LinkedIn","Contacted",27),
  makeLead("Nikhil Joshi","CodeCraft","nikhil@codecraft.in","9845623000","Referral","Contacted",28),
  makeLead("Preethi Nair","DataSync","preethi@datasync.co","9867312000","Website","Contacted",29),
  makeLead("Vivek Mehta","SkyBound","vivek@skybound.in","9856231000","Google Ads","Contacted",30),
  makeLead("Rekha Pillai","TechVision","rekha@techvision.co","9823412000","LinkedIn","Contacted",31),
  // Proposal Sent (11)
  makeLead("Manish Agarwal","Alpha Ventures","manish@alphaventures.co","9876543100","Referral","Proposal Sent",35),
  makeLead("Sunita Shah","Nova Design Co.","sunita@novadesign.com","9812345100","Website","Proposal Sent",36),
  makeLead("Ravi Kumar","Spark Digital","ravi@sparkdigital.in","9867432100","Google Ads","Proposal Sent",37),
  makeLead("Kavitha Menon","UrbanTech","kavitha@urbantech.co","9845621100","LinkedIn","Proposal Sent",38),
  makeLead("Sanjay Verma","BrightPath","sanjay@brightpath.in","9856743100","Website","Proposal Sent",39),
  makeLead("Pooja Iyer","ClearSky","pooja@clearsky.co","9823456100","Referral","Proposal Sent",40),
  makeLead("Ashok Rao","LeadGen Pro","ashok@leadgenpro.in","9876123100","Google Ads","Proposal Sent",41),
  makeLead("Neeta Sharma","DataDrive","neeta@datadrive.co","9812643100","Website","Proposal Sent",42),
  makeLead("Harish Nair","SwiftGrow","harish@swiftgrow.in","9845713100","LinkedIn","Proposal Sent",43),
  makeLead("Disha Patel","WebBridge","disha@webbridge.co","9867234100","Referral","Proposal Sent",44),
  makeLead("Ajay Singh","TechCore","ajay@techcore.in","9856412100","Google Ads","Proposal Sent",45),
  // Negotiation (6)
  makeLead("Ananya Singh","Pixel Studio","ananya@pixelstudio.co","9876543200","LinkedIn","Negotiation",50),
  makeLead("Ravi Mehta","ZenCorp","ravi@zencorp.in","9812345200","Website","Negotiation",51),
  makeLead("Sneha Kumar","BrandWave","sneha@brandwave.co","9867432200","Referral","Negotiation",52),
  makeLead("Vijay Patel","GrowthLabs","vijay@growthlabs.in","9845621200","Google Ads","Negotiation",53),
  makeLead("Priya Sharma","DigiNation","priya@digination.co","9856743200","LinkedIn","Negotiation",54),
  makeLead("Akash Jain","CoreBuild","akash@corebuild.in","9823456200","Website","Negotiation",55),
  // Converted (5)
  makeLead("Deepak Sharma","BrightMedia","deepak@brightmedia.in","9876543300","Referral","Converted",60),
  makeLead("Riya Gupta","CoreTech Solutions","riya@coretech.io","9812345300","Website","Converted",62),
  makeLead("Neel Patel","SwiftBrand","neel@swiftbrand.co","9867432300","LinkedIn","Converted",65),
  makeLead("Mina Shah","WebStar","mina@webstar.in","9845621300","Google Ads","Converted",68),
  makeLead("Priya Kumar","DigitalEdge","priya@digitaledge.co","9856743300","Referral","Converted",70),
  // Lost (13) — for conversion rate: 5/(5+13) = 27.8% ≈ 28%
  makeLead("Suresh Kumar","OldTech","suresh@oldtech.in","9800000001","Website","Lost",80),
  makeLead("Radha Nair","PastVentures","radha@past.co","9800000002","Referral","Lost",82),
  makeLead("Kartik Shah","ByeBrand","kartik@byebrand.in","9800000003","LinkedIn","Lost",84),
  makeLead("Manu Patel","NoWay Inc.","manu@noway.co","9800000004","Google Ads","Lost",86),
  makeLead("Tina Roy","OldBuild","tina@oldbuild.in","9800000005","Website","Lost",88),
  makeLead("Raj Sharma","PastCode","raj@pastcode.co","9800000006","Referral","Lost",90),
  makeLead("Asha Gupta","TechGone","asha@techgone.in","9800000007","LinkedIn","Lost",92),
  makeLead("Dev Kumar","OldSpark","dev@oldspark.co","9800000008","Google Ads","Lost",94),
  makeLead("Neha Singh","ByeDigital","neha@byedigital.in","9800000009","Website","Lost",96),
  makeLead("Ravi Pillai","PastBrand","ravi@pastbrand.co","9800000010","Referral","Lost",98),
  makeLead("Kavya Roy","OldNation","kavya@oldnation.in","9800000011","LinkedIn","Lost",100),
  makeLead("Amit Shah","ByeCore","amit@byecore.co","9800000012","Google Ads","Lost",102),
  makeLead("Priya Das","TechPast","priya@techpast.in","9800000013","Website","Lost",104),
];

const INITIAL_CLIENTS: Client[] = [
  // 6 shown in dashboard widget
  { id: makeId(), name: "BrightMedia", domain: "brightmedia.in", project: "Brand Identity", value: "₹95K", valueNum: 95000, monthlyValue: 12000, status: "Active", avatar: "BM" },
  { id: makeId(), name: "Alpha Ventures", domain: "alphaventures.co", project: "Website Redesign", value: "₹2.4L", valueNum: 240000, monthlyValue: 20000, status: "Active", avatar: "AV" },
  { id: makeId(), name: "CoreTech Solutions", domain: "coretech.io", project: "Mobile App UI", value: "₹1.1L", valueNum: 110000, monthlyValue: 0, status: "Waiting", avatar: "CT" },
  { id: makeId(), name: "Nova Design Co.", domain: "novadesign.com", project: "Dashboard UI", value: "₹75K", valueNum: 75000, monthlyValue: 8000, status: "Active", avatar: "ND" },
  { id: makeId(), name: "ZenCorp", domain: "zencorp.in", project: "E-commerce", value: "₹3.2L", valueNum: 320000, monthlyValue: 0, status: "At Risk", avatar: "ZC" },
  { id: makeId(), name: "GreenLeaf Co.", domain: "greenleaf.co", project: "SEO + Content", value: "₹45K", valueNum: 45000, monthlyValue: 0, status: "Waiting", avatar: "GL" },
  // More active clients to reach 32 active
  { id: makeId(), name: "TechNova Inc.", domain: "technova.in", project: "Product Landing", value: "₹1.8L", valueNum: 180000, monthlyValue: 15000, status: "Active", avatar: "TN" },
  { id: makeId(), name: "SwiftBrand", domain: "swiftbrand.co", project: "Brand Strategy", value: "₹65K", valueNum: 65000, monthlyValue: 7000, status: "Active", avatar: "SB" },
  { id: makeId(), name: "DigitalEdge", domain: "digitaledge.co", project: "UI/UX Audit", value: "₹50K", valueNum: 50000, monthlyValue: 6000, status: "Active", avatar: "DE" },
  { id: makeId(), name: "WebStar", domain: "webstar.in", project: "Web Development", value: "₹1.2L", valueNum: 120000, monthlyValue: 10000, status: "Active", avatar: "WS" },
  { id: makeId(), name: "InnoVate Tech", domain: "innovate.in", project: "App Design", value: "₹90K", valueNum: 90000, monthlyValue: 9000, status: "Active", avatar: "IT" },
  { id: makeId(), name: "PixelPro", domain: "pixelpro.in", project: "Logo + Identity", value: "₹40K", valueNum: 40000, monthlyValue: 5000, status: "Active", avatar: "PP" },
  { id: makeId(), name: "TechSpark", domain: "techspark.in", project: "Marketing Site", value: "₹80K", valueNum: 80000, monthlyValue: 8500, status: "Active", avatar: "TS" },
  { id: makeId(), name: "AppForge", domain: "appforge.in", project: "SaaS Dashboard", value: "₹2.1L", valueNum: 210000, monthlyValue: 18000, status: "Active", avatar: "AF" },
  { id: makeId(), name: "BrandLab", domain: "brandlab.in", project: "Campaign Design", value: "₹55K", valueNum: 55000, monthlyValue: 6500, status: "Active", avatar: "BL" },
  { id: makeId(), name: "CodeNation", domain: "codenation.co", project: "Dev + Design", value: "₹1.5L", valueNum: 150000, monthlyValue: 13000, status: "Active", avatar: "CN" },
  { id: makeId(), name: "CloudNine", domain: "cloudnine.co", project: "Cloud Dashboard", value: "₹1.0L", valueNum: 100000, monthlyValue: 9500, status: "Active", avatar: "C9" },
  { id: makeId(), name: "MarketEdge", domain: "marketedge.co", project: "Growth Design", value: "₹70K", valueNum: 70000, monthlyValue: 7500, status: "Active", avatar: "ME" },
  { id: makeId(), name: "DataDrive", domain: "datadrive.co", project: "Analytics UI", value: "₹85K", valueNum: 85000, monthlyValue: 8800, status: "Active", avatar: "DD" },
  { id: makeId(), name: "CreativeHub", domain: "creativehub.co", project: "Visual Identity", value: "₹60K", valueNum: 60000, monthlyValue: 7200, status: "Active", avatar: "CH" },
  { id: makeId(), name: "EcoVentures", domain: "ecoventures.co", project: "Eco Landing", value: "₹45K", valueNum: 45000, monthlyValue: 5500, status: "Active", avatar: "EV" },
  { id: makeId(), name: "NextGen Solutions", domain: "nextgen.co", project: "Portal Design", value: "₹1.3L", valueNum: 130000, monthlyValue: 11000, status: "Active", avatar: "NG" },
  { id: makeId(), name: "BrandBoost", domain: "brandboost.in", project: "Rebranding", value: "₹75K", valueNum: 75000, monthlyValue: 8000, status: "Active", avatar: "BB" },
  { id: makeId(), name: "SkyBound", domain: "skybound.in", project: "SaaS UI Kit", value: "₹95K", valueNum: 95000, monthlyValue: 9800, status: "Active", avatar: "SK" },
  { id: makeId(), name: "CodeCraft", domain: "codecraft.in", project: "Component Lib", value: "₹1.1L", valueNum: 110000, monthlyValue: 10500, status: "Active", avatar: "CC" },
  { id: makeId(), name: "DataSync", domain: "datasync.co", project: "Data Viz", value: "₹80K", valueNum: 80000, monthlyValue: 8200, status: "Active", avatar: "DS" },
  { id: makeId(), name: "TechVision", domain: "techvision.co", project: "Vision 2025 Site", value: "₹55K", valueNum: 55000, monthlyValue: 6000, status: "Active", avatar: "TV" },
  { id: makeId(), name: "Digital First", domain: "digitalfirst.co", project: "Digital Strategy", value: "₹65K", valueNum: 65000, monthlyValue: 7000, status: "Active", avatar: "DF" },
  { id: makeId(), name: "LeadGen Pro", domain: "leadgenpro.in", project: "Funnel Design", value: "₹48K", valueNum: 48000, monthlyValue: 5800, status: "Active", avatar: "LG" },
  { id: makeId(), name: "WebBridge", domain: "webbridge.co", project: "Bridge Portal", value: "₹72K", valueNum: 72000, monthlyValue: 7800, status: "Active", avatar: "WB" },
  { id: makeId(), name: "SwiftGrow", domain: "swiftgrow.in", project: "Growth Site", value: "₹58K", valueNum: 58000, monthlyValue: 6800, status: "Active", avatar: "SG" },
  { id: makeId(), name: "Spark Digital", domain: "sparkdigital.in", project: "Spark Rebrand", value: "₹90K", valueNum: 90000, monthlyValue: 9200, status: "Active", avatar: "SD" },
  // Waiting clients
  { id: makeId(), name: "UrbanTech", domain: "urbantech.co", project: "Urban App UI", value: "₹1.4L", valueNum: 140000, monthlyValue: 0, status: "Waiting", avatar: "UT" },
  { id: makeId(), name: "BrightPath", domain: "brightpath.in", project: "Path Platform", value: "₹62K", valueNum: 62000, monthlyValue: 0, status: "Waiting", avatar: "BP" },
  { id: makeId(), name: "TechPulse", domain: "techpulse.in", project: "Pulse Dashboard", value: "₹88K", valueNum: 88000, monthlyValue: 0, status: "Waiting", avatar: "TP" },
  { id: makeId(), name: "ClearSky", domain: "clearsky.co", project: "Sky Portal", value: "₹52K", valueNum: 52000, monthlyValue: 0, status: "Waiting", avatar: "CS" },
  { id: makeId(), name: "GrowthLabs", domain: "growthlabs.in", project: "Lab Interface", value: "₹1.0L", valueNum: 100000, monthlyValue: 0, status: "Waiting", avatar: "GR" },
  { id: makeId(), name: "TechCore", domain: "techcore.in", project: "Core System UI", value: "₹78K", valueNum: 78000, monthlyValue: 0, status: "Waiting", avatar: "TC" },
  // At Risk clients
  { id: makeId(), name: "Pixel Studio", domain: "pixelstudio.co", project: "Studio Revamp", value: "₹1.6L", valueNum: 160000, monthlyValue: 0, status: "At Risk", avatar: "PS" },
  { id: makeId(), name: "DigiNation", domain: "digination.co", project: "Nation Portal", value: "₹42K", valueNum: 42000, monthlyValue: 0, status: "At Risk", avatar: "DN" },
  { id: makeId(), name: "CoreBuild", domain: "corebuild.in", project: "Build System", value: "₹1.2L", valueNum: 120000, monthlyValue: 0, status: "At Risk", avatar: "CB" },
];

const INITIAL_TASKS: Task[] = [
  // Pending (18)
  { id: makeId(), title: "Design logo concepts for CoreTech", assignee: "Riya (Designer)", dueDate: "Jun 18", status: "pending", priority: "high", client: "CoreTech Solutions" },
  { id: makeId(), title: "Prepare proposal for TechNova", assignee: "Arjun (Lead)", dueDate: "Jun 17", status: "pending", priority: "high", client: "TechNova Inc." },
  { id: makeId(), title: "Client onboarding call — BrightMedia", assignee: "Agency Owner", dueDate: "Jun 19", status: "pending", priority: "medium", client: "BrightMedia" },
  { id: makeId(), title: "Wireframes for Alpha Ventures site", assignee: "Riya (Designer)", dueDate: "Jun 20", status: "pending", priority: "high", client: "Alpha Ventures" },
  { id: makeId(), title: "Follow up with GreenLeaf Co.", assignee: "Agency Owner", dueDate: "Jun 17", status: "pending", priority: "medium", client: "GreenLeaf Co." },
  { id: makeId(), title: "Send revised pricing to ZenCorp", assignee: "Agency Owner", dueDate: "Jun 16", status: "pending", priority: "high", client: "ZenCorp" },
  { id: makeId(), title: "UI review for Nova Design dashboard", assignee: "Riya (Designer)", dueDate: "Jun 21", status: "pending", priority: "medium", client: "Nova Design Co." },
  { id: makeId(), title: "Set up analytics for SwiftBrand", assignee: "Dev Team", dueDate: "Jun 22", status: "pending", priority: "low", client: "SwiftBrand" },
  { id: makeId(), title: "Content strategy deck — DigitalEdge", assignee: "Agency Owner", dueDate: "Jun 23", status: "pending", priority: "medium", client: "DigitalEdge" },
  { id: makeId(), title: "Typography system for InnoVate Tech", assignee: "Riya (Designer)", dueDate: "Jun 24", status: "pending", priority: "low", client: "InnoVate Tech" },
  { id: makeId(), title: "Prepare monthly report — WebStar", assignee: "Agency Owner", dueDate: "Jun 25", status: "pending", priority: "medium", client: "WebStar" },
  { id: makeId(), title: "Contract draft for NextGen Solutions", assignee: "Agency Owner", dueDate: "Jun 19", status: "pending", priority: "high", client: "NextGen Solutions" },
  { id: makeId(), title: "Competitor analysis — AppForge", assignee: "Dev Team", dueDate: "Jun 26", status: "pending", priority: "low", client: "AppForge" },
  { id: makeId(), title: "Social media kit — BrandLab", assignee: "Riya (Designer)", dueDate: "Jun 27", status: "pending", priority: "medium", client: "BrandLab" },
  { id: makeId(), title: "API integration spec — CodeNation", assignee: "Dev Team", dueDate: "Jun 28", status: "pending", priority: "high", client: "CodeNation" },
  { id: makeId(), title: "Review feedback from CloudNine", assignee: "Agency Owner", dueDate: "Jun 18", status: "pending", priority: "medium", client: "CloudNine" },
  { id: makeId(), title: "Brand guideline doc — MarketEdge", assignee: "Riya (Designer)", dueDate: "Jun 29", status: "pending", priority: "low", client: "MarketEdge" },
  { id: makeId(), title: "Demo prep for DataDrive client", assignee: "Agency Owner", dueDate: "Jun 16", status: "pending", priority: "high", client: "DataDrive" },
  // Overdue (3)
  { id: makeId(), title: "Deliver mockups to GrowthLabs", assignee: "Riya (Designer)", dueDate: "Jun 10", status: "overdue", priority: "high", client: "GrowthLabs" },
  { id: makeId(), title: "Invoice follow-up — TechVision", assignee: "Agency Owner", dueDate: "Jun 8", status: "overdue", priority: "high", client: "TechVision" },
  { id: makeId(), title: "Revision rounds for Pixel Studio", assignee: "Riya (Designer)", dueDate: "Jun 5", status: "overdue", priority: "medium", client: "Pixel Studio" },
  // Completed (42)
  ...Array.from({ length: 42 }, (_, i) => ({
    id: makeId(),
    title: [
      "Homepage design for BrightMedia", "Color palette for CoreTech", "Discovery call — PixelPro",
      "Initial proposal deck", "Client kickoff meeting", "Moodboard presentation",
      "SEO audit report", "Mobile wireframes", "Feedback incorporation",
      "Logo presentation", "Typography selection", "Icon set design",
      "Contract signed — SwiftBrand", "Payment received — WebStar", "Project brief review",
      "Stakeholder meeting", "Design system setup", "Component library",
      "User flow mapping", "Prototype review", "Usability testing",
      "Dev handoff — BrandBoost", "Final delivery — SkyBound", "Post-launch review",
      "NPS survey sent", "Case study drafted", "Portfolio update",
      "Invoice sent — CodeCraft", "Client testimonial collected", "Retainer negotiated",
      "Brand audit — DataSync", "Accessibility review", "Cross-browser testing",
      "Performance audit", "Animation spec", "Micro-interaction review",
      "Style guide delivered", "Design QA pass", "Launch checklist done",
      "Team retrospective", "Monthly report sent", "Quarterly planning"
    ][i % 42],
    assignee: ["Riya (Designer)", "Dev Team", "Agency Owner"][i % 3],
    dueDate: `May ${(i % 28) + 1}`,
    status: "completed" as const,
    priority: (["high", "medium", "low"] as const)[i % 3],
    client: INITIAL_CLIENTS[i % 10].name,
  })),
];

const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: makeId(), iconType: "file", iconBg: "#DBEAFE", iconColor: "#2563EB",
    title: "Proposal sent to TechNova",
    subtitle: "₹1.8L branding + web project",
    time: "2 hrs ago", timestamp: new Date(Date.now() - 2 * 3600 * 1000),
  },
  {
    id: makeId(), iconType: "phone", iconBg: "#EDE9FE", iconColor: "#7C3AED",
    title: "Discovery call completed",
    subtitle: "GreenLeaf Co. — 45 min session",
    time: "4 hrs ago", timestamp: new Date(Date.now() - 4 * 3600 * 1000),
  },
  {
    id: makeId(), iconType: "check", iconBg: "#DCFCE7", iconColor: "#22C55E",
    title: "Client converted",
    subtitle: "BrightMedia signed ₹95K retainer",
    time: "Yesterday", timestamp: new Date(Date.now() - 24 * 3600 * 1000),
  },
  {
    id: makeId(), iconType: "clipboard", iconBg: "#FEF3C7", iconColor: "#F59E0B",
    title: "Task assigned to designer",
    subtitle: "Logo concepts for CoreTech",
    time: "Yesterday", timestamp: new Date(Date.now() - 28 * 3600 * 1000),
  },
  {
    id: makeId(), iconType: "sign", iconBg: "#DCFCE7", iconColor: "#22C55E",
    title: "Contract signed",
    subtitle: "Alpha Ventures — ₹2.4L website",
    time: "2 days ago", timestamp: new Date(Date.now() - 48 * 3600 * 1000),
  },
];

const INITIAL_FOLLOWUPS: Followup[] = [
  { id: makeId(), company: "ABC Corp", contact: "Arjun Sharma", when: "Tomorrow, 10:00 AM", whenLabel: "Tomorrow", type: "meeting", tag: "Discovery", tagColor: "#2563EB", tagBg: "#DBEAFE", completed: false },
  { id: makeId(), company: "XYZ Ltd", contact: "Priya Malhotra", when: "Today, 3:00 PM", whenLabel: "Today", type: "call", tag: "Follow-up", tagColor: "#D97706", tagBg: "#FEF3C7", completed: false },
  { id: makeId(), company: "GreenTech", contact: "Vikram Nair", when: "Friday, 11:30 AM", whenLabel: "Friday", type: "meeting", tag: "Proposal", tagColor: "#7C3AED", tagBg: "#EDE9FE", completed: false },
  { id: makeId(), company: "Pixel Studio", contact: "Ananya Singh", when: "Next Mon, 2:00 PM", whenLabel: "Monday", type: "call", tag: "Negotiation", tagColor: "#DC2626", tagBg: "#FEE2E2", completed: false },
];

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: makeId(), title: "New lead assigned", message: "Krish Mehta from TechFlow Solutions added", time: "2 min ago", read: false, type: "lead" },
  { id: makeId(), title: "Task overdue", message: "Deliver mockups to GrowthLabs is past due", time: "1 hr ago", read: false, type: "task" },
  { id: makeId(), title: "Client at risk", message: "ZenCorp flagged as At Risk — action needed", time: "3 hrs ago", read: false, type: "client" },
  { id: makeId(), title: "Proposal accepted", message: "Alpha Ventures approved ₹2.4L proposal", time: "Yesterday", read: true, type: "lead" },
  { id: makeId(), title: "Payment received", message: "₹95,000 from BrightMedia — Invoice #1042", time: "2 days ago", read: true, type: "client" },
];

// ─── Context ────────────────────────────────────────────────────────────────

interface CRMContextValue {
  leads: Lead[];
  clients: Client[];
  tasks: Task[];
  activities: Activity[];
  followups: Followup[];
  notifications: Notification[];
  activeView: View;
  searchQuery: string;
  // Computed KPIs
  totalLeads: number;
  activeClientsCount: number;
  conversionRate: number;
  monthlyRevenue: number;
  prevMonthlyRevenue: number;
  // Actions
  setActiveView: (v: View) => void;
  setSearchQuery: (q: string) => void;
  addLead: (data: Omit<Lead, "id" | "createdAt">) => void;
  moveLeadStage: (leadId: string, stage: Stage) => void;
  addTask: (data: Omit<Task, "id">) => void;
  completeTask: (id: string) => void;
  updateClientStatus: (id: string, status: Client["status"]) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  completeFollowup: (id: string) => void;
  rescheduleFollowup: (id: string, when: string, whenLabel: string) => void;
  addActivity: (a: Omit<Activity, "id">) => void;
}

const CRMContext = createContext<CRMContextValue | null>(null);

export function useCRM() {
  const ctx = useContext(CRMContext);
  if (!ctx) throw new Error("useCRM must be within CRMProvider");
  return ctx;
}

function formatRelativeTime(d: Date): string {
  const diffMs = Date.now() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 2) return "Just now";
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hr${diffHr > 1 ? "s" : ""} ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay === 1) return "Yesterday";
  return `${diffDay} days ago`;
}

export function CRMProvider({ children }: { children: React.ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [activities, setActivities] = useState<Activity[]>(INITIAL_ACTIVITIES);
  const [followups, setFollowups] = useState<Followup[]>(INITIAL_FOLLOWUPS);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [activeView, setActiveView] = useState<View>("Dashboard");
  const [searchQuery, setSearchQuery] = useState("");

  // Computed KPIs
  const totalLeads = leads.length + HISTORICAL_LEAD_OFFSET;
  const activeClientsCount = clients.filter(c => c.status === "Active").length;
  const convertedLeads = leads.filter(l => l.stage === "Converted").length;
  const lostLeads = leads.filter(l => l.stage === "Lost").length;
  const conversionRate = lostLeads + convertedLeads > 0
    ? Math.round((convertedLeads / (convertedLeads + lostLeads)) * 100)
    : 0;
  const monthlyRevenue = clients
    .filter(c => c.status === "Active")
    .reduce((sum, c) => sum + c.monthlyValue, 0);
  const prevMonthlyRevenue = Math.round(monthlyRevenue * 0.85);

  const addActivity = useCallback((data: Omit<Activity, "id">) => {
    const act: Activity = { ...data, id: makeId() };
    setActivities(prev => [act, ...prev.slice(0, 19)]);
    const notif: Notification = {
      id: makeId(),
      title: data.title,
      message: data.subtitle,
      time: "Just now",
      read: false,
      type: data.iconType === "user" ? "lead" : data.iconType === "task" ? "task" : "client",
    };
    setNotifications(prev => [notif, ...prev.slice(0, 19)]);
  }, []);

  const addLead = useCallback((data: Omit<Lead, "id" | "createdAt">) => {
    const lead: Lead = { ...data, id: makeId(), createdAt: new Date() };
    setLeads(prev => [...prev, lead]);
    addActivity({
      iconType: "user", iconBg: "#DBEAFE", iconColor: "#2563EB",
      title: `New lead added: ${data.name}`,
      subtitle: `${data.company} · ${data.stage}`,
      time: "Just now", timestamp: new Date(),
    });
  }, [addActivity]);

  const moveLeadStage = useCallback((leadId: string, stage: Stage) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, stage } : l));
    const lead = leads.find(l => l.id === leadId);
    if (lead) {
      addActivity({
        iconType: "move", iconBg: "#EDE9FE", iconColor: "#7C3AED",
        title: `Lead moved to ${stage}`,
        subtitle: `${lead.name} · ${lead.company}`,
        time: "Just now", timestamp: new Date(),
      });
    }
  }, [leads, addActivity]);

  const addTask = useCallback((data: Omit<Task, "id">) => {
    const task: Task = { ...data, id: makeId() };
    setTasks(prev => [...prev, task]);
    addActivity({
      iconType: "clipboard", iconBg: "#FEF3C7", iconColor: "#F59E0B",
      title: `Task added: ${data.title}`,
      subtitle: `Assigned to ${data.assignee} · Due ${data.dueDate}`,
      time: "Just now", timestamp: new Date(),
    });
  }, [addActivity]);

  const completeTask = useCallback((id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: "completed" } : t));
    const task = tasks.find(t => t.id === id);
    if (task) {
      addActivity({
        iconType: "task", iconBg: "#DCFCE7", iconColor: "#22C55E",
        title: `Task completed: ${task.title}`,
        subtitle: `By ${task.assignee}`,
        time: "Just now", timestamp: new Date(),
      });
    }
  }, [tasks, addActivity]);

  const updateClientStatus = useCallback((id: string, status: Client["status"]) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    const client = clients.find(c => c.id === id);
    if (client) {
      addActivity({
        iconType: "check", iconBg: "#DCFCE7", iconColor: "#22C55E",
        title: `Client status updated`,
        subtitle: `${client.name} → ${status}`,
        time: "Just now", timestamp: new Date(),
      });
    }
  }, [clients, addActivity]);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const completeFollowup = useCallback((id: string) => {
    setFollowups(prev => prev.map(f => f.id === id ? { ...f, completed: true } : f));
    const f = followups.find(fu => fu.id === id);
    if (f) {
      addActivity({
        iconType: "check", iconBg: "#DCFCE7", iconColor: "#22C55E",
        title: `Follow-up completed`,
        subtitle: `${f.company} · ${f.type}`,
        time: "Just now", timestamp: new Date(),
      });
    }
  }, [followups, addActivity]);

  const rescheduleFollowup = useCallback((id: string, when: string, whenLabel: string) => {
    setFollowups(prev => prev.map(f => f.id === id ? { ...f, when, whenLabel } : f));
  }, []);

  return (
    <CRMContext.Provider value={{
      leads, clients, tasks, activities, followups, notifications,
      activeView, searchQuery,
      totalLeads, activeClientsCount, conversionRate, monthlyRevenue, prevMonthlyRevenue,
      setActiveView, setSearchQuery,
      addLead, moveLeadStage, addTask, completeTask, updateClientStatus,
      markNotificationRead, markAllNotificationsRead,
      completeFollowup, rescheduleFollowup, addActivity,
    }}>
      {children}
    </CRMContext.Provider>
  );
}
