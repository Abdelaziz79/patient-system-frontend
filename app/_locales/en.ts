const en = {
  // --- Global Dialog/Button/Tab Text & Common Actions ---
  addPatientEvent: "Add Patient Event",
  addEventDescription: "Add a new medical event to the patient's history.",
  nextStep: "Next Step",
  back: "Back",
  adding: "Adding...",
  addEvent: "Add Event",
  cancel: "Cancel",
  cancelEventCreation: "Cancel event creation",
  requiredFieldsNotice: "* Fields with an asterisk are required",
  failedToAddEvent: "Failed to add event.",
  errorAddingEvent: "An error occurred while adding the event.",
  eventAddedSuccess: "Event added successfully!",
  saveChanges: "Save Changes",
  saving: "Saving...",
  edit: "Edit",
  view: "View",
  delete: "Delete",
  add: "Add",
  continue: "Continue",
  processing: "Processing...",
  loading: "Loading...",
  error: "Error",
  tryAgain: "Try Again",
  noDataAvailable: "No data available",
  unknown: "Unknown",
  notAvailable: "N/A",
  default: "Default",
  actions: "Actions",
  overview: "Overview",
  details: "Details",
  description: "Description",
  status: "Status",
  type: "Type",
  category: "Category",
  search: "Search...",
  filter: "Filter", // Assuming a general filter label might be useful, though not explicitly present
  clearFilters: "Clear Filters",
  perPage: "per page",
  showing: "Showing",
  of: "of",
  page: "Page",
  id: "ID",
  name: "Name", // Generic name, used in patient table and potentially elsewhere
  notes: "Notes",
  reason: "Reason",
  summary: "Summary",
  active: "Active",
  inactive: "Inactive",
  all: "All",
  yes: "Yes",
  no: "No",
  private: "Private", // Used for templates, might be generic
  custom: "Custom", // Used for notifications, might be generic
  from: "From",
  to: "To", // Assuming a general "to" for date ranges etc.
  today: "Today",
  tomorrow: "Tomorrow",
  viewAll: "ViewAll", // Changed to ViewAll from View All to match key style if it were a key
  exit: "Exit",
  print: "Print",
  export: "Export",
  share: "Share",
  download: "Download",
  copy: "Copy",
  duplicate: "Duplicate",
  dismiss: "Dismiss",
  confirm: "Confirm", // Generic confirm action
  backToDashboard: "Back to Dashboard",
  goBack: "Go Back",
  select: "Select",
  complete: "Complete",
  refresh: "Refresh",

  // --- Login Page ---
  loginHeading: "Login",
  loginWelcomeMessage:
    "Welcome to the Patient System. Please login to continue.",
  emailLabel: "Email",
  enterYourEmail: "Enter your email",
  passwordLabel: "Password",
  enterYourPassword: "Enter your password",
  rememberMe: "Remember me",
  loginButton: "Login",
  loadingButton: "Loading...", // Often used for button states
  dontHaveAccount: "Don't have an account?",
  createNewAccount: "Create a new account",
  forgotPassword: "Forgot password?",
  contactAdmin: "Please contact your administrator for assistance",
  contactAdminForAccount:
    "Please contact your administrator to create an account",
  loginSuccess: "Login successful",
  invalidCredentials: "Invalid credentials",

  // --- User Form & Management (Create/Update User) ---
  createNewUser: "Create New User",
  updateUser: "Update User",
  addNewUserDescription: "Add a new user to the healthcare system",
  updateUserDescription: "Update user information",
  createUser: "Create User",
  creating: "Creating...",
  updating: "Updating...",
  nameRequired: "Name is required", // General name required, contextually user name
  emailRequired: "Email is required",
  passwordRequired: "Password is required",
  passwordMinLength: "Password must be at least 6 characters",
  passwordPlaceholder: "••••••",
  fullNamePlaceholder: "Full name",
  emailPlaceholder: "email@example.com",
  selectRole: "Select role",
  contactNumberPlaceholder: "+20 1234567890",
  failedToLoadUsers: "Failed to load users",
  userDataRefreshed: "User data refreshed",
  failedToRefreshData: "Failed to refresh data",
  manageUsersDescription: "Manage system users, roles, and permissions",
  users: "Users", // General term for users
  bulkSelect: "Bulk Select",
  selected: "selected",
  missingUserIdUpdate: "Missing user ID for update",
  failedToCreateUser: "Failed to create user",
  failedToUpdateUser: "Failed to update user",

  // --- User Profile Page ---
  userProfile: "User Profile",
  backToUsers: "Back to Users",
  userIdRequired: "User ID is required",
  failedToLoadUserData: "Failed to load user data",
  unexpectedErrorFetchingUser:
    "An unexpected error occurred while fetching user data",
  userNotFound: "User not found",
  myProfile: "My Profile",
  viewManageAccount: "View and manage your account information",
  accountInformation: "Account Information",
  accountActivity: "Account Activity",
  accountSettings: "Account Settings",
  fullName: "Full Name",
  emailAddress: "Email Address",
  contactNumber: "Contact Number",
  specialization: "Specialization",
  notProvided: "Not provided",
  editProfile: "Edit Profile",
  cancelEditing: "Cancel Editing",
  accountCreated: "Account Created",
  lastLogin: "Last Login",
  lastUpdated: "Last Updated",
  subscriptionStatus: "Subscription Status",
  daysRemaining: "days remaining",
  startDate: "Start Date",
  endDate: "End Date",
  userNotAuthenticated:
    "User not authenticated. Please log in to view your profile.",
  loggedOutSuccessfully: "Logged out successfully",
  errorLoggingOut: "Error logging out",
  logoutButton: "Logout", // Also used in sidebar

  // --- Admin Actions (User Management Card/Actions) ---
  adminActions: "Admin Actions",
  manageUserAccount: "Manage this user account",
  editUserDetails: "Edit User Details",
  deactivateUser: "Deactivate User",
  reactivateUser: "Reactivate User",
  deactivateUserConfirmation:
    "Are you sure you want to deactivate this user? This action can be reversed later.",
  reactivateUserConfirmation: "Are you sure you want to reactivate this user?",
  confirmDeactivation: "Confirm Deactivation",
  confirmReactivation: "Confirm Reactivation",
  failedToDeactivateUser: "Failed to deactivate user",
  failedToReactivateUser: "Failed to reactivate user",
  successfullyDeactivatedUser: "Successfully deactivated user",
  successfullyDeactivatedUsers: "Successfully deactivated {count} users",
  failedToDeactivateUsers: "Failed to deactivate {count} users",
  bulkDeactivationError: "An error occurred during bulk deactivation",
  successfullyReactivatedUser: "Successfully reactivated user",
  successfullyReactivatedUsers: "Successfully reactivated {count} users",
  failedToReactivateUsers: "Failed to reactivate {count} users",
  bulkReactivationError: "An error occurred during bulk reactivation",
  successfullyResetPassword: "Reset password for user",
  successfullyResetPasswords: "Reset passwords for {count} users",
  failedToResetPassword: "Failed to reset password for user",
  failedToResetPasswords: "Failed to reset passwords for {count} users",
  bulkPasswordResetError: "An error occurred during bulk password reset",
  invitationSent: "Invitation sent to user",
  invitationsSent: "Sent invitations to {count} users",
  bulkInviteError: "An error occurred while sending invitations",
  resetPasswordForUser: "Reset password for user",
  resetting: "Resetting...",

  // --- Password Change Modal ---
  changePassword: "Change Password",
  currentPassword: "Current Password",
  newPassword: "New Password",
  confirmPassword: "Confirm Password",
  changing: "Changing...",
  currentPasswordRequired: "Current password is required",
  newPasswordRequired: "New password is required",
  passwordsDoNotMatch: "Passwords do not match",
  failedToChangePassword: "Failed to change password",

  // --- Subscription Management ---
  updateSubscriptionFor: "Update subscription for user:",
  subscriptionType: "Subscription Type",
  selectSubscriptionType: "Select subscription type",
  subscriptionTypeRequired: "Subscription type is required",
  startDateRequired: "Start date is required", // Also generic
  endDateRequired: "End date is required", // Also generic
  endDateMustBeAfterStartDate: "End date must be after start date",
  subscriptionUpdatedSuccess: "Subscription updated successfully",
  failedToUpdateSubscription: "Failed to update subscription",
  activeSubscription: "Active Subscription",
  features: "Features",
  reportsExport: "Reports Export",
  patientManagement: "Patient Management",
  advancedAnalytics: "Advanced Analytics",
  multipleUsers: "Multiple Users",
  apiAccess: "API Access",
  support247: "24/7 Support",
  customIntegration: "Custom Integration",
  updateSubscription: "Update Subscription",
  freeTrial: "Free Trial",

  // --- Patient Event Creation: Dialog & Basic Info ---
  basicInfo: "Basic Info", // Tab/Section Title for event creation
  eventDetails: "Event Details", // Tab/Section Title for event creation
  eventTitleRequired: "Event title is required.",
  title: "Title", // Field label for event title
  eventTitlePlaceholder: "e.g., Follow-up Appointment, Blood Test Results",
  dateAndTime: "Date and Time",
  eventType: "Event Type", // Field label
  selectEventType: "Select Event Type", // Placeholder for event type dropdown
  importance: "Importance", // Field label
  selectImportance: "Select importance", // Placeholder for importance dropdown
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
  addEventDialogTitle: "Add New Event",
  addEventDialogDescription: "Add a new event to the patient's timeline",
  eventDetailsPlaceholder: "Describe the event details", // Generic event details placeholder

  // --- Patient Event Creation: Event Type Names (Used in Select Item for Event Type) ---
  general: "General Note", // Also used in surgery anesthesia type
  medication: "Medication",
  procedure: "Procedure",
  lab_result: "Lab Result",
  diagnosis: "Diagnosis",
  referral: "Referral",
  appointment: "Appointment", // Also used as a sidebar item
  therapy: "Therapy",
  surgery: "Surgery",
  lab: "Lab Order",
  consultation: "Consultation",
  admission: "Admission",
  discharge: "Discharge",
  other: "Other",
  // More specific event types if needed, these cover the provided ones
  labTest: "Lab Test", // Appears in Patient Events section
  hospitalAdmission: "Hospital Admission", // Appears in Patient Events section
  hospitalDischarge: "Hospital Discharge", // Appears in Patient Events section

  // --- Patient Event Creation: Event Detail Field Labels (Dynamic) ---
  // Keys derived from field.name.replace("_", " ")
  "medication name": "Medication Name",
  dosage: "Dosage",
  frequency: "Frequency",
  route: "Route",
  duration: "Duration",
  prescriber: "Prescriber",
  "procedure name": "Procedure Name",
  "performed by": "Performed By",
  location: "Location",
  outcome: "Outcome",
  "test name": "Test Name",
  result: "Result",
  "reference range": "Reference Range",
  "diagnosis name": "Diagnosis Name",
  "diagnosis code": "Diagnosis Code",
  "diagnosed by": "Diagnosed By",
  "referred to": "Referred To",
  "referred by": "Referred By",

  urgent: "Urgent",
  provider: "Provider",

  "therapy type": "Therapy Type",
  therapist: "Therapist",
  surgeon: "Surgeon",
  "anesthesia type": "Anesthesia Type",
  complications: "Complications",
  "ordered by": "Ordered By",
  consultant: "Consultant",
  specialty: "Specialty", // Also user specialization
  recommendations: "Recommendations",
  facility: "Facility",
  "admitting physician": "Admitting Physician",
  room: "Room",
  "expected stay": "Expected Stay",
  "discharging physician": "Discharging Physician",
  "discharge disposition": "Discharge Disposition",
  "follow up": "Follow Up",
  instructions: "Instructions",

  // --- Patient Event Creation: Event Detail Field Placeholders (Dynamic) ---
  // Keys derived from `${field.name}Placeholder`
  notesPlaceholder: "Add detailed notes about the event...",
  medication_namePlaceholder: "e.g., Aspirin",
  dosagePlaceholder: "e.g., 81 mg",
  frequencyPlaceholder: "e.g., Once daily",
  routePlaceholder: "e.g., Oral, IV, etc.",
  durationPlaceholder: "e.g., 3 months",
  prescriberPlaceholder: "e.g., Dr. Smith",
  procedure_namePlaceholder: "e.g., Colonoscopy",
  performed_byPlaceholder: "e.g., Dr. Jones",
  locationPlaceholder: "e.g., St. Luke's Hospital",
  outcomePlaceholder: "Describe the outcome...",
  test_namePlaceholder: "e.g., CBC",
  resultPlaceholder: "e.g., Hemoglobin 14.5 g/dL",
  reference_rangePlaceholder: "e.g., 13.5-17.5 g/dL",
  diagnosis_namePlaceholder: "e.g., Hypertension",
  diagnosis_codePlaceholder: "e.g., I10",
  diagnosed_byPlaceholder: "e.g., Dr. Lee",
  referred_toPlaceholder: "e.g., Cardiology",
  referred_byPlaceholder: "e.g., Primary Care Physician",
  reasonPlaceholder: "Reason for referral/visit...",
  urgentPlaceholder: "e.g., Yes/No",
  providerPlaceholder: "e.g., Dr. Adams",
  statusPlaceholder: "e.g., Scheduled, Completed",
  therapy_typePlaceholder: "e.g., Physical Therapy",
  therapistPlaceholder: "e.g., John Doe, PT",
  surgeonPlaceholder: "e.g., Dr. Brown",
  anesthesia_typePlaceholder: "Select type",
  complicationsPlaceholder: "Describe any complications...",
  ordered_byPlaceholder: "e.g., Dr. White",
  consultantPlaceholder: "e.g., Dr. Black",
  specialtyPlaceholder: "e.g., Dermatology",
  recommendationsPlaceholder: "List recommendations...",
  facilityPlaceholder: "e.g., County General Hospital",
  admitting_physicianPlaceholder: "e.g., Dr. Brown",
  roomPlaceholder: "e.g., Room 305",
  expected_stayPlaceholder: "e.g., 3-5 days",
  discharging_physicianPlaceholder: "e.g., Dr. Green",
  discharge_dispositionPlaceholder: "Select disposition",
  follow_upPlaceholder: "Describe follow-up plans...",
  instructionsPlaceholder: "List discharge instructions...",
  categoryPlaceholder: "e.g., Administrative, Social",

  // --- Patient Event Creation: Select Input Placeholders ---
  selectRoute: "Select Route",
  selectUrgent: "Select Urgency",
  selectStatus: "Select Status", // Generic, also used for appointment status
  selectAnesthesia_type: "Select Anesthesia Type",
  selectDischarge_disposition: "Select Discharge Disposition",

  // --- Patient Event Creation: Select Option Values ---
  // Medication Route options
  oral: "Oral",
  intravenous: "Intravenous",
  intramuscular: "Intramuscular",
  subcutaneous: "Subcutaneous",
  topical: "Topical",
  inhalation: "Inhalation",
  // Referral Urgent options: 'yes', 'no' already globally defined
  // Appointment Status options
  scheduled: "Scheduled",
  completed: "Completed", // Also used for lab status
  cancelled: "Cancelled", // Also used for lab status
  no_show: "No Show",
  // Surgery Anesthesia Type options

  local: "Local",
  regional: "Regional",
  sedation: "Sedation",
  none: "None",
  // Lab Status options
  ordered: "Ordered",
  collected: "Collected",
  in_process: "In Process",
  // 'completed' and 'cancelled' are defined above
  // Discharge Disposition options
  home: "Home",
  skilled_nursing: "Skilled Nursing Facility",
  rehabilitation: "Rehabilitation Facility",
  long_term_care: "Long-Term Care Facility",
  expired: "Expired", // Also used for subscription plans
  // Patient Status Options (used in Patient Edit and Status section)
  on_treatment: "On Treatment",
  in_remission: "In Remission",
  deceased: "Deceased",

  discharged_home: "Discharged Home",
  discharged_hospital: "Discharged Hospital",

  // --- Dashboard / General App UI Elements ---
  patientDashboard: "Patient Dashboard",
  aiDemographicsSummary: "AI Demographics Summary",
  demographicsSummary: "Demographics Summary",
  generatingSummary: "Generating demographics summary...",
  thisMayTakeAMoment: "This may take a moment",
  totalPatients: "Total Patients",
  totalVisits: "Total Visits",
  newPatientsRecent: "New Patients (Recent)",
  quickActions: "Quick Actions",
  addNewPatient: "Add New Patient",
  viewPatientList: "View Patient List",
  genderDistribution: "Gender Distribution",
  ageGroups: "Age Groups",
  patientStatus: "Patient Status", // Also a section in patient details
  monthlyPatientTrends: "Monthly Patient Trends",
  templateUsage: "Template Usage",
  patients: "patients", // Also a sidebar item
  uses: "uses",

  // --- User Statistics Page (Admin/Management) ---
  userStats: "User Stats", // Sidebar item
  totalUsers: "Total Users",
  newUsers: "New Users",
  aiUserInsights: "AI User Insights",
  generatingUserInsights: "Generating user insights...",
  failedToLoadUserStatistics: "Failed to load user statistics.",
  activeUsers: "Active Users",
  inactiveUsers: "Inactive Users",
  userActivityStatus: "User Activity Status",
  activeVsInactive: "Active vs Inactive user distribution",
  noUserDataAvailable: "No user data available.",
  usersByRole: "Users by Role",
  roleDistribution: "Role distribution",
  roleDistributionNotAvailable: "Role distribution data not available.",
  subscriptionDetailsSuperAdmins:
    "Subscription details available for Super Admins only.",
  subscriptionStats: "Subscription Stats",
  usersSubscriptionTiers: "Users across subscription tiers",
  freeTrials: "Free Trials",
  basicPlan: "Basic Plan",
  premiumPlan: "Premium Plan",
  enterprisePlan: "Enterprise Plan",
  expiredPlans: "Expired Plans",
  // Roles (used in user stats and user form)
  doctor: "Doctor",
  nurse: "Nurse",
  staff: "Staff",
  admin: "Admin", // Also a sidebar category
  roles: "Roles", // Tab on User Stats page
  rolesAndSubscriptions: "Roles & Subscriptions", // Section title

  // --- Activity Tab (User Stats or General Activity) ---
  recentActivity: "Recent Activity", // Tab on User Stats page
  recentRegistrations: "Recent Registrations",
  usersWhoJoinedRecently: "Users who joined recently",
  neverJoined: "Never joined",
  noRecentRegistrations: "No recent registrations found.",
  recentLogins: "Recent Logins",
  usersWhoLoggedInRecently: "Users who logged in recently",
  neverLoggedIn: "Never logged in",
  noRecentLoginData: "No recent login data available.",

  // --- Admin Functionality (General) ---
  manageUsers: "Manage Users", // Page title or section
  noPermissionAdminPage: "You don't have permission to access this admin page.",

  // --- Sidebar Navigation ---
  profile: "Profile",
  appointments: "Appointments", // Page title/sidebar
  notifications: "Notifications", // Page title/sidebar
  reports: "Reports", // Page title/sidebar
  templates: "Templates", // Page title/sidebar
  systemNotifications: "System Notifications", // Page title/sidebar
  backups: "Backups", // Page title/sidebar
  patient: "Patient", // Sidebar category or item
  settings: "Settings", // Page title/sidebar
  lightMode: "Light Mode",
  darkMode: "Dark Mode",
  logout: "Logout", // General logout action
  login: "Login", // General login action
  main: "Main", // Sidebar category
  clinical: "Clinical", // Sidebar category
  management: "Management", // Sidebar category
  system: "System", // Sidebar category

  // --- Header Component ---
  patientSystem: "Patient System",
  register: "Register",
  user: "User", // Generic term, also dropdown in header
  loadingNotifications: "Loading notifications...",
  loadingSystemNotifications: "Loading system notifications...",
  noAppointmentNotifications: "No appointment notifications",
  noSystemNotifications: "No system notifications",
  unreadMessage: "unread message",
  allCaughtUp: "All caught up!",

  // --- Footer Component ---
  platformDescription:
    "Integrated platform for patient and medical appointment management designed to streamline healthcare workflows.",
  help: "Help",
  faq: "FAQ",
  contactUs: "Contact Us",
  technicalSupport: "Technical Support",
  documentation: "Documentation",
  quickLinks: "Quick Links",
  address: "123 Medical Center Blvd, Healthcare City, HC 12345",
  phone: "+1 (555) 123-4567",
  email: "support@patientsystem.com",
  allRightsReserved: "All Rights Reserved",
  privacyPolicy: "Privacy Policy",
  termsOfService: "Terms of Service",

  // --- Patients List Page ---
  patientsList: "Patients List",
  managePatientRecords: "Manage patient records in your medical facility",
  addPatient: "Add Patient", // Button
  searchForPatient: "Search for a patient...",
  noPatients: "No patients found",
  tryChangingSearch: "Try changing your search criteria or add new patients",
  patientsLabel: "Patients", // Label for count, e.g., "100 Patients"
  fileNumber: "File No.",
  // 'name' is generic, here for Patient Name column
  phoneTranslate: "Phone", // Key is 'phoneTranslate' to avoid conflict if 'phone' is used elsewhere
  age: "Age",
  gender: "Gender",
  template: "Template", // Column header
  createdBy: "Added By",
  added: "Created At", // Column header for creation date
  loadingPatientRecords: "Loading patient records...",
  filteredResults: "Filtered results",

  // --- Settings Page ---
  mySettings: "My Settings", // Page title
  customizeSettings: "Customize your application preferences and settings", // Page description
  appearance: "Appearance",
  language: "Language",
  privacySecurity: "Privacy & Security",
  systemPreferences: "System Preferences",
  clearAllNotifications: "Clear All Notifications",

  // --- Templates Page (List View) ---
  addTemplate: "Add Template", // Also a quick action
  manageTemplates: "Manage your patient templates", // Page title
  createTemplate: "Create Template", // Button
  aiGenerate: "AI Generate", // Button
  searchTemplates: "Search templates...",
  availableTemplates: "Available Templates",
  loadingTemplates: "Loading templates...",
  noTemplatesFound:
    "No templates found. Create your first template to get started.",
  templateDeletedSuccess: "Template deleted successfully",
  failedToDeleteTemplate: "Failed to delete template",
  errorDeletingTemplate: "An error occurred while deleting the template",
  templateDuplicatedSuccess: "Template duplicated successfully",
  failedToDuplicateTemplate: "Failed to duplicate template",
  errorDuplicatingTemplate: "An error occurred while duplicating the template",
  noDescriptionProvided: "No description provided", // For template cards
  section: "section", // Singular
  sections: "sections", // Plural
  standardTemplate: "Standard Template", // Used in patient edit page

  // --- AI Template Generator ---
  generateTemplateWithAI: "Generate Template with AI",
  aiTemplateGenerator: "AI Template Generator", // Modal title
  aiTemplateDescription:
    "Enter a medical condition and our AI will generate a suitable patient template with relevant sections and fields.",
  pleaseEnterMedicalCondition: "Please enter a medical condition",
  generatingTemplate: "Generating template...",
  templateGeneratedSuccess: "Template generated successfully",
  failedToGenerateTemplate: "Failed to generate template",
  errorGeneratingTemplate: "An error occurred while generating the template",
  medicalCondition: "Medical Condition", // Field label
  medicalConditionPlaceholder: "e.g., Diabetes, Hypertension, Asthma",
  specializationOptional: "Specialization (Optional)", // Field label
  specializationPlaceholder: "e.g., Cardiology, Pediatrics, General Practice",
  generating: "Generating...", // Button state
  generateTemplate: "Generate Template", // Button
  preparingYourContent: "Preparing your content...", // Loading state

  // --- Template Detail/Editor Page ---
  backToTemplates: "Back to Templates",
  createNewTemplate: "Create New Template", // Page title for new
  defineTemplateStructure: "Define template structure and fields", // Subtitle for new
  viewTemplateDetails: "View template details", // Page title for view
  editTemplateStructure: "Edit template structure and fields", // Subtitle for edit
  editTemplate: "Edit Template", // Page title for edit
  viewOnly: "View Only", // Indicator
  saveTemplate: "Save Template", // Button
  templateCreatedSuccess: "Template created successfully",
  templateUpdatedSuccess: "Template updated successfully",
  failedToSaveTemplate: "Failed to save template",
  errorSavingTemplate: "An error occurred while saving the template",
  templateNameRequired: "Template name is required",
  templateSectionRequired: "Template must have at least one section",
  templateInfo: "Template Information", // Section title
  templateName: "Template Name", // Field label
  basicTemplateDescription: "Basic details about this patient template", // Description for name field
  templateDescription: "Description (Optional)", // Field label
  isPrivate: "Private Template", // Field label (checkbox)
  isPrivateDescription: "Private templates are only visible to you",
  isDefault: "Default Template", // Field label (checkbox)
  isDefaultDescription: "Default templates are available to all users",
  sectionsAndFields: "Sections & Fields", // Section title
  noPermissionEdit: "You don't have permission to edit this template",
  templateStats: "Template Stats",
  templateSections: "Template Sections",
  created: "Created", // Meta info
  creator: "Creator", // Meta info
  newTemplate: "New template", // Default name or placeholder
  templateDetails: "Template Details", // Used in Patient Edit Page

  // --- Section Dialog (Template Editor) ---
  editSection: "Edit Section", // Dialog title
  addNewSection: "Add New Section", // Dialog title / Button text
  sectionDialogDescription:
    "Create or modify a section to organize related fields",
  sectionName: "Section Name", // Field label
  sectionNamePlaceholder: "e.g. personalInfo",
  sectionNameDescription: "Internal name used in code (no spaces, lowercase)",
  displayLabel: "Display Label", // Field label
  sectionLabelPlaceholder: "e.g. Personal Information",
  sectionLabelDescription: "User-friendly label displayed in the UI",
  sectionDescription: "Description (Optional)", // Field label
  sectionDescriptionPlaceholder: "Describe this section's purpose",
  saveSection: "Save Section", // Button

  // --- Field Dialog (Template Editor) ---
  editField: "Edit Field", // Dialog title
  addNewField: "Add New Field", // Dialog title / Button text
  fieldDialogDescription: "Configure the field properties",
  fieldName: "Field Name", // Field label
  fieldNamePlaceholder: "e.g. firstName",
  fieldNameDescription: "Internal name (no spaces)",
  fieldLabel: "Display Label", // Field label
  fieldLabelPlaceholder: "e.g. First Name",
  fieldLabelDescription: "User-friendly label",
  fieldType: "Field Type", // Field label
  selectFieldType: "Select field type", // Placeholder
  requiredField: "Required Field", // Checkbox label
  fieldDescription: "Description (Optional)", // Field label
  fieldDescriptionPlaceholder: "Help text for this field",
  options: "Options", // For select/radio/checkbox group fields
  addNewOption: "Add new option", // Button
  noOptionsAdded: "No options added yet",
  saveField: "Save Field", // Button

  // --- Template Sections Component (Template Editor) ---
  organizeSectionsFields: "Organize fields into logical sections", // Title/Header
  addSection: "Add Section", // Button
  noSectionsFound: "No Sections Found", // Empty state
  startAddingSections:
    "Start by adding sections to organize your template fields. Sections help group related patient information.", // Empty state description
  addFirstSection: "Add First Section", // Button in empty state
  sectionsCount: "sections defined", // e.g., "3 sections defined"
  sectionCount: "section defined", // e.g., "1 section defined"
  addAnotherSection: "Add Another Section", // Button

  // --- Delete Confirmation Alerts ---
  deleteSection: "Delete Section", // Alert title
  deleteSectionConfirm:
    "Are you sure you want to delete this section? This will also delete all fields within this section. This action cannot be undone.", // Alert message
  deleteField: "Delete Field", // Alert title
  deleteFieldConfirm:
    "Are you sure you want to delete this field? This action cannot be undone.", // Alert message
  confirmDelete: "Yes, Delete Backup", // Also used for backups, generic confirm delete

  // --- Export Settings/Functionality ---
  exportData: "Export Data", // Page/Section title
  exportDescription:
    "Export your data in different formats for backup or analysis purposes",
  exportPatient: "Export Patient",
  exportPatients: "Export Patients",
  exportAllPatients: "Export All Patients",
  exportUser: "Export User",
  exportAllUsers: "Export All Users",
  filterPatientsExport:
    "Filter patients to export and select your desired format",
  pdfReport: "PDF Report", // Option
  fromDate: "From Date", // Filter
  toDate: "To Date", // Filter
  filterByStatus: "Filter by status", // Filter
  filterByTag: "Filter by tag", // Filter
  activePatientsOnly: "Active patients only", // Filter option
  exportAsExcel: "Export as Excel",
  exportAsCSV: "Export as CSV",
  tag: "Tag", // Filter label / general term
  exportAs: "Export As", // Used in patient details action menu
  excelFormat: "Excel (.xlsx)",
  csvFormat: "CSV (.csv)",
  pdfFormat: "PDF (.pdf)", // Also used in patient details export options
  patientDataExportedAs: "Patient data exported as {{format}}",
  failedToExportAs: "Failed to export patient data as {{format}}",

  // --- Appointments Page ---
  addNewAppointment: "Add Appointment", // Button / Page title
  searchAppointments: "Search appointments...",
  appointmentType: "Appointment Type", // Filter
  next7Days: "Next 7 days", // Filter option
  next14Days: "Next 14 days", // Filter option
  next30Days: "Next 30 days", // Filter option
  next3Months: "Next 3 months", // Filter option
  loadingAppointments: "Loading appointments...",
  errorLoadingAppointments: "Error loading appointments. Please try again.",
  noAppointmentsFound: "No appointments found",
  noUpcomingAppointments:
    "There are no upcoming appointments in the selected time range",
  viewDetails: "View Details", // Button/Link
  days: "days", // Unit
  in: "In", // e.g., "In 5 days"
  daysFrom: "days from now", // e.g., "5 days from now"
  scheduleAppointment: "Schedule Appointment", // Button/Action
  tryAgainLater: "Please try again later", // Error message fallback

  // --- Notifications Page (User-facing) ---
  manageNotifications: "Manage appointments and system notifications", // Page title
  filterPeriod: "Filter Period",
  filterStatus: "Filter Status",
  allNotifications: "All Notifications", // Filter option
  unreadOnly: "Unread Only", // Filter option
  readOnly: "Read Only", // Filter option
  thisWeek: "This Week", // Filter option
  viewAllAppointments: "View All Appointments", // Link
  noNotificationsFound: "No notifications found",
  noUnreadNotifications: "You don't have any unread notifications",
  noReadNotifications: "You don't have any read notifications",
  unreadNotification: "unread notification", // Singular
  markAllAsRead: "Mark All as Read", // Button
  allNotificationsMarkedRead: "All notifications marked as read",
  failedToMarkAllRead: "Failed to mark all notifications as read",

  // --- Notification Type Labels & Actions (General) ---
  subscription: "Subscription", // Notification type
  message: "Message", // Notification type
  notification: "Notification", // Generic notification type
  markAsRead: "Mark as read", // Action
  read: "Read", // Status indicator / Action
  highPriority: "High Priority", // Indicator

  // --- Reports Page (List View) ---
  reportsDescription: "Generate and analyze patient data and medical insights", // Page description
  myReports: "My Reports", // Tab or section
  createReport: "Create Report", // Button
  aiAnalysis: "AI Analysis", // Section or feature
  newReport: "New Report", // Default name or placeholder
  filterReports: "Filter reports",
  searchReports: "Search reports...",
  allReports: "All reports", // Filter
  patientReports: "Patient reports", // Filter
  analyticsReports: "Analytics reports", // Filter
  financialReports: "Financial reports", // Filter
  savedReports: "Saved Reports", // Section
  selectReport: "Select a Report", // Placeholder text
  selectReportToView: "Please select a report from the list to view", // Placeholder
  noReportsFound: "No reports found", // General empty state
  noMatchingReports: "No reports match your search criteria", // Search empty state
  noReportsYet: "You don't have any reports yet", // Initial empty state
  noReportsDescription: "Create your first report to start analyzing your data", // Initial empty state description
  createFirstReport: "Create your first report", // Button in initial empty state
  deleteReport: "Delete Report", // Action / Alert title
  deleteReportConfirmation:
    "Are you sure you want to delete this report? This action cannot be undone.", // Alert message
  deleting: "Deleting...", // Action state
  analytics: "Analytics", // Report category
  financials: "Financials", // Report category
  charts: "charts", // e.g., "3 charts"
  noDescription: "No description provided", // For report cards
  accessDenied: "Access Denied",
  noAccessToReports:
    "You don't have access to the reports section. Please contact your administrator.",
  visitReports: "Visit Reports",
  statusReports: "Status Reports",
  customReports: "Custom Reports",
  noReportsOfType: "No reports of this type found",
  reportCategory: "Category", // For report details

  // --- Report Builder / Chart Translations ---

  advanced: "Advanced Options", // Or 'advancedOptions'
  filters: "Filters", // Also used for report details
  includeFields: "Include Fields",
  defaultChartsWillBeAdded: "Default charts will be added based on report type",
  reportResults: "Report Results",

  statusDistribution: "Status Distribution", // Chart title
  patientsSummary: "Patients Summary", // Chart title
  avgPerPatient: "Avg. Per Patient", // Metric
  unsupportedChartType: "Unsupported chart type",

  visitsSummary: "Visits Summary", // Chart title
  comingSoon: "Coming soon!", // Placeholder for features/charts
  reportVisualizations: "Report Visualizations",
  reportChart: "chart", // Singular, for "1 chart"
  chartsPlural: "s generated", // For "charts generated"
  noVisualizationsYet: "No Visualizations Yet",
  generateReportToViewCharts:
    "Generate the report to view charts and visualizations based on your configured data.",
  allCharts: "All Charts", // Filter or display option
  bar: "Bar Chart",
  line: "Line Chart",
  pie: "Pie Chart",
  table: "Table Chart", // Or just "Table"
  heatmap: "Heatmap Chart",
  scatter: "Scatter Chart",
  noChartsOfTypeAvailable: "No charts of this type available",

  // --- Report Details Page ---
  reportNotFound: "Report Not Found",
  reportNotFoundDescription:
    "The report you're looking for doesn't exist or you don't have access to it.",
  backToReports: "Back to Reports",
  reportDetails: "Report Details", // Page title

  loadingReportData: "Loading report data...",
  reportNotGeneratedYet: "This report hasn't been generated yet.",
  generateNow: "Generate Now", // Button
  regenerate: "Regenerate", // Button

  reportType: "Type", // Report metadata
  favorite: "Favorite", // Action/Status
  notFavorited: "Not favorited", // Status
  reportVisibilityPrivate: "Private",
  reportVisibilityPublic: "Public",
  standardReport: "Standard Report", // Type or classification
  reportIncludedFields: "Included Fields", // Section
  reportFilters: "Filters", // Section
  reportFiltersApplied: "filter(s) applied",
  generateReport: "Generate Report", // Button
  reportGenerated: "Report generated successfully",
  reportGenerationFailed: "Failed to generate report",
  reportDownloaded: "Report downloaded successfully",

  // --- Report Type Translations (for display) ---
  reportType_patient: "Patient",
  reportType_visit: "Visit",
  reportType_status: "Status",
  reportType_custom: "Custom",

  // --- Admin Notifications Page (System-wide) ---
  manageSystemNotifications: "Manage system notifications for all users", // Page title
  checkSubscriptions: "Check Subscriptions", // Button
  checking: "Checking...", // Action state
  subscriptionCheckSuccess: "Subscription check completed successfully",
  subscriptionCheckFailed: "Failed to check subscriptions",
  createNotification: "Create Notification", // Button
  createSystemNotification: "Create System Notification", // Dialog title
  notificationDialogDescription:
    "Send a notification to all users or specific individuals. This will appear in their notifications panel.",
  notificationTitle: "Notification title", // Field label
  notificationMessage: "Notification message", // Field label

  selectType: "Select type", // Placeholder

  expiresAfterDays: "Expires After (days)", // Field label
  sendToAllUsers: "Send to all users", // Checkbox label
  targetUsersDescription:
    "When unchecked, you can select specific users to receive this notification",
  selectUsers: "Select Users", // Button / Field label
  loadingUsers: "Loading users...",
  noUsersAvailable: "No users available",
  sending: "Sending...", // Action state
  sendNotification: "Send Notification", // Button
  expires: "Expires", // Column header / display label
  noNotificationsOfType: "No notifications of the selected type",
  byType: "By Type", // Filter label
  selectNotificationType: "Select notification type", // Placeholder
  systemNotification: "System Notification", // Type option
  customMessage: "Custom Message", // Type option
  subscriptionAlert: "Subscription Alert", // Type option
  patientEvent: "Patient Event", // Type option
  allUsers: "All Users", // Recipient display
  recipient: "Recipient",
  recipients: "Recipients",

  // --- Enhanced Notification Features (Admin) ---
  checkEvents: "Check Events", // Button
  eventsCheckSuccess: "Event check completed successfully",
  eventsCheckFailed: "Failed to check upcoming events",
  patientId: "Patient ID", // Field label
  eventId: "Event ID", // Field label
  enterPatientId: "Enter patient ID", // Placeholder
  enterEventId: "Enter event ID", // Placeholder
  patientEventDescription: "Notify users about important patient events", // For notification type
  notificationTypeDescription: "Select the type of notification to send", // Help text

  // --- Backup Page (Admin) ---
  systemBackups: "System Backups", // Page title
  manageSystemBackups: "Manage and restore system backups", // Page description
  noPermissionBackupPage:
    "You don't have permission to access the backups page. Please contact your administrator.",

  createBackup: "Create Backup", // Button
  createNewBackup: "Create New Backup", // Dialog title
  createBackupDescription:
    "Create a new system backup with a name and optional description",
  backupName: "Backup Name", // Field label
  backupNamePlaceholder: "e.g. Pre-update Backup Jan 2023",
  descriptionOptional: "Description (optional)", // Field label
  backupCreatedSuccess: "Backup created successfully",
  backupCreationFailed: "Failed to create backup",
  backupNameRequired: "Backup name is required",
  searchBackups: "Search backups...",
  sortBy: "Sort by", // Label for sort dropdown
  newestFirst: "Newest first", // Sort option
  oldestFirst: "Oldest first", // Sort option
  alphabetical: "Alphabetical", // Sort option
  availableBackups: "Available Backups", // Section title
  manageBackupsDescription: "View, restore, or delete your system backups", // Section subtitle
  noBackupsMatch: "No backups match your search criteria",
  noBackupsAvailable: "No backups available", // Initial empty state
  tryDifferentSearch: "Try a different search term", // Suggestion
  createFirstBackup: "Create your first backup to protect your data", // Empty state CTA
  restore: "Restore", // Button / Action
  downloadStarted: "Download started", // Toast/Notification
  restoreSystem: "Restore System", // Dialog title / Confirmation action
  restoreSystemWarning:
    "Are you sure you want to restore the system to this backup?", // Confirmation message
  restoreDataLossWarning:
    "Restoring will replace all current data with the backup data. Any changes made since this backup was created will be lost.", // Warning
  restoring: "Restoring...", // Action state
  confirmRestore: "Yes, Restore System", // Confirmation button
  backupRestoredSuccess: "System restored successfully",
  backupRestoreFailed: "Failed to restore system",
  deleteBackup: "Delete Backup", // Action / Alert title
  deleteBackupConfirmation:
    "Are you sure you want to delete this backup? This action cannot be undone.", // Alert message

  backupDeletedSuccess: "Backup deleted successfully",
  backupDeleteFailed: "Failed to delete backup",
  backupsCount: "backups available", // e.g., "5 backups available"
  noBackupsFound: "No backups found", // Used when search yields no results but backups exist

  // --- Footer Actions Component (e.g., Patient Detail Footer) ---
  backToPatients: "Back to Patients",

  editPatient: "Edit Patient",
  addVisit: "Add Visit",

  // --- Tags Component ---
  tags: "Tags", // Section title
  tagAlreadyExists: "This tag already exists",
  failedToAddTag: "Failed to add tag",
  tagAddedSuccess: 'Tag "{{tag}}" added successfully',
  failedToRemoveTag: "Failed to remove tag",
  tagRemovedSuccess: 'Tag "{{tag}}" removed successfully',
  unexpectedError: "An unexpected error occurred", // Generic error for tags
  removeTag: "Remove tag", // Tooltip or button text
  noTagsYet: "No tags added yet", // Empty state
  addNewTagPlaceholder: "Add a new tag...",

  // --- Patient Status Section (Patient Detail Page) ---
  invalidDate: "Invalid date",
  statusOptionNotFound: "Status option not found",
  patientStatusUpdated: "Patient status updated to {{status}}",
  failedToUpdateStatus: "Failed to update status",
  errorUpdatingStatus: "An error occurred while updating status",
  managePatientStatusAndHistory: "Manage patient status and view history", // Section title
  currentStatus: "Current Status",
  since: "Since", // e.g., "Since Jan 1, 2023"
  changeStatus: "Change Status", // Button
  statusHistory: "Status History", // Sub-section title

  // --- Patient Info Card (Patient Detail Page) ---
  unnamedPatient: "Unnamed Patient", // Default display name
  yearsOld: "years old", // e.g., "35 years old"
  medicalRecordNumber: "MRN",
  unknownStatus: "Unknown Status", // Default status display
  basicInformation: "Basic Information", // Section title on card
  birthdate: "Birthdate",
  contactInformation: "Contact Information", // Section title on card
  recordInformation: "Record Information", // Section title on card
  emergencyContact: "Emergency Contact", // Field label
  relation: "Relation", // Field label (emergency contact)
  insuranceInformation: "Insurance Information", // Section title on card
  policyNumber: "Policy #",
  groupNumber: "Group #",
  personalInformation: "Personal Information", // Also a section in patient edit

  // --- Patient Events Section (Patient Detail Page) ---
  patientEvents: "Patient Events", // Section title
  activeEvents: "active events", // e.g., "5 active events"
  analyzing: "Analyzing...", // General AI analysis state
  aiEventAnalysis: "AI Event Analysis", // Title for AI section/modal
  analyzingEventsAndPatterns: "Analyzing events and patterns...", // AI loading text
  lookingForTrends: "Looking for trends and correlations", // AI loading text
  noEventsToAnalyze: "No events available to analyze",
  noNotablePatternsFound: "No notable patterns found in the events.",
  analysisCompleteNoPatterns:
    "Analysis complete, but no notable patterns were found",
  failedToAnalyzeEvents: "Failed to analyze events",
  errorDuringEventAnalysis: "An error occurred during event analysis",
  confirmDeleteEvent: "Are you sure you want to delete this event?", // Alert message
  eventDeletedSuccess: "Event deleted successfully",
  failedToDeleteEvent: "Failed to delete event",
  errorDeletingEvent: "An error occurred while deleting the event",
  eventRestoredSuccess: "Event restored successfully",
  failedToRestoreEvent: "Failed to restore event",
  errorRestoringEvent: "An error occurred while restoring the event",
  priority: "priority", // e.g., "High priority"
  noEventsRecorded: "No events recorded for this patient", // Empty state
  addFirstEventDescription:
    "Add the first event to start building this patient's timeline", // Empty state description
  addFirstEvent: "Add First Event", // Button in empty state

  // --- Patient Detail Page (General, AI, Actions) ---
  patientDetails: "Patient Details", // Page title or header
  aiInsights: "AI Insights", // Tab or section title
  aiReport: "AI Report", // Button or section title
  patientActions: "Patient Actions", // Dropdown menu title
  aiAnalysisAndInsights: "AI Analysis & Insights", // Section title
  analyzingPatientData: "Analyzing patient data...", // Loading text
  medicalAssessmentReport: "Medical Assessment Report", // Report title
  generated: "Generated", // e.g., "Generated on Jan 1, 2023"
  saveReport: "Save Report", // Button
  generatingComprehensiveReport: "Generating comprehensive patient report...", // Loading text
  analyzingMedicalHistory: "Analyzing medical history and current status", // Loading text
  insightsGeneratedSuccess: "Insights generated successfully",
  failedToGenerateInsights: "Failed to generate insights",
  patientIdRequired: "Patient ID is required", // For API calls or routing
  noAnalysisAvailable: "No analysis available", // Empty state for AI insights
  aiReportGeneratedSuccess: "AI report generated successfully",
  failedToGenerateAIReport: "Failed to generate AI report",
  errorGeneratingAIReport: "An error occurred while generating the AI report",
  noReportDataToSave: "No report data available to save",
  medicalAssessmentFor: "Medical Assessment for", // e.g., "Medical Assessment for John Doe"
  reportSavedSuccess: "Report saved successfully",
  failedToSaveReport: "Failed to save report",

  // --- Patient Tabs Component (Patient Detail Page) ---
  patientInformation: "Patient Information", // Tab label, also a page title for edit
  info: "Info", // Short tab label
  visits: "Visits", // Tab label, also a page title
  treatmentSuggestions: "Treatment Suggestions", // Tab label
  treatment: "Treatment", // Short tab label

  // --- Patient Info Tab (Patient Detail Page) ---
  allSectionsFrom: "All sections from", // e.g., "All sections from Standard Template"
  noPatientInformationAvailable: "No patient information available", // Empty state
  patientNoSectionsRecorded:
    "This patient doesn't have any information sections recorded yet.", // Empty state description

  // --- Visits Tab (Patient Detail Page) ---
  visitHistory: "Visit History", // Section title
  patientVisitsAndAppointments: "Patient visits and appointments", // Section description
  visitOn: "Visit on", // e.g., "Visit on Jan 1, 2023"
  visitDetails: "Visit Details", // Link/Button
  noVisitsRecorded: "No visits recorded for this patient", // Empty state
  addFirstVisitTracking:
    "Add the first visit to start tracking this patient's history", // Empty state description
  addFirstVisit: "Add First Visit", // Button in empty state

  // --- Status Tab (Patient Detail Page - distinct from Patient Status Section component) ---
  changesInPatientStatus: "Changes in patient status over time", // Section title
  historyLabel: "History", // Generic label, here for status history
  updatedBy: "Updated by",
  noStatusHistoryAvailable: "No status history available", // Empty state
  statusChangesWillAppear: "Status changes will appear here when they occur", // Empty state description

  // --- Treatment Tab (Patient Detail Page) ---
  aiPoweredTreatmentSuggestions:
    "AI-powered treatment suggestions based on patient data", // Section title/description

  // --- Treatment Suggestions Component (within Treatment Tab) ---
  treatmentSuggestionsGenerator: "Treatment Suggestions Generator", // Component title
  symptoms: "Symptoms", // Field label
  describePatientSymptoms: "Describe the patient's symptoms", // Placeholder/Help text
  provideSymptomsAccurateSuggestions:
    "Provide detailed symptoms for more accurate suggestions", // Help text
  currentTreatments: "Current Treatments", // Field label
  listCurrentTreatments: "List current treatments and medications (optional)", // Placeholder
  enterRelevantMedicalHistory: "Enter relevant medical history (optional)", // Placeholder
  generatingSuggestions: "Generating Suggestions...", // Loading state
  generateTreatmentSuggestions: "Generate Treatment Suggestions", // Button
  aiTreatmentSuggestions: "AI Treatment Suggestions", // Title for results
  analyzingGeneratingTreatment: "Analyzing and generating treatment options...", // Loading text
  treatmentConsideringPatientSymptoms:
    "This may take a moment while we consider the patient's symptoms and medical history", // Loading text
  pleaseEnterSymptoms: "Please enter the symptoms", // Validation message
  treatmentSuggestionsGenerated: "Treatment suggestions generated successfully",
  failedToGenerateTreatmentSuggestions:
    "Failed to generate treatment suggestions",
  medicalHistory: "Medical History", // Field label

  // --- Not Found Page (404) ---
  pageNotFound: "Page Not Found",
  pageNotFoundDescription:
    "Sorry, the page you are looking for doesn't exist, has been moved, or deleted.",
  returnToHome: "Return to Home",

  // --- Form Field General Translations ---
  selectDate: "Select date",

  isRequired: "is required", // e.g., "Field Name is required"
  invalidEmail: "Invalid email address",
  invalidPhone: "Invalid phone number",
  completeRequiredFields:
    'Please complete all required fields in "{{section}}" before proceeding.',
  previousSection: "Previous Section", // For multi-step forms
  nextSection: "Next Section", // For multi-step forms
  formProgress: "Form Progress", // Patient Edit Page

  // --- AI Event Analysis Tools (Patient Detail Page, Events Section) ---
  aiTools: "AI Tools", // Dropdown or section title
  insights: "Insights", // Action/Result type
  correlation: "Correlation", // Action/Result type
  getEventInsights: "Get Event Insights", // Button
  getEventRecommendations: "Get Event Recommendations", // Button
  analyzeEventCorrelation: "Analyze Event Correlation", // Button
  legacyAiAnalysis: "Legacy AI Analysis", // Option if older system exists
  eventInsights: "Event Insights", // Modal/Section title for results
  eventRecommendations: "Event Recommendations", // Modal/Section title for results
  eventCorrelation: "Event Correlation", // Modal/Section title for results
  generatingRecommendations: "Generating recommendations...", // Loading text
  analyzingEventHistory: "Analyzing event history", // Loading text
  analyzingCorrelations: "Analyzing correlations...", // Loading text
  findingCausalRelationships: "Finding causal relationships", // Loading text
  lookingForPatterns: "Looking for patterns", // Loading text
  noInsightsFound: "No insights found",
  noRecommendationsFound: "No recommendations found",
  noCorrelationFound: "No correlation found",
  failedToGetEventInsights: "Failed to get event insights",
  failedToGetEventRecommendations: "Failed to get event recommendations",
  failedToGetEventCorrelation: "Failed to get event correlation",
  errorGettingEventInsights: "Error getting event insights",
  errorGettingEventRecommendations: "Error getting event recommendations",
  errorGettingEventCorrelation: "Error getting event correlation",

  // --- Specific Field Labels/Placeholders (Potentially duplicated or specific context) ---
  // These were at the end of the original list. Many are covered in "Patient Event Creation"
  // Re-listing them here to ensure they are captured as per original list,
  // but commented if already well-defined earlier.
  medication_name: "Medication Name", // Already under Event Detail Field Labels (key: "medication name")
  procedure_name: "Procedure Name", // Already under Event Detail Field Labels (key: "procedure name")
  performed_by: "Performed By", // Already under Event Detail Field Labels (key: "performed by")
  test_name: "Test Name", // Already under Event Detail Field Labels (key: "test name")
  reference_range: "Reference Range", // Already under Event Detail Field Labels (key: "reference range")
  diagnosis_name: "Diagnosis Name", // Already under Event Detail Field Labels (key: "diagnosis name")
  diagnosis_code: "Diagnosis Code", // Already under Event Detail FieldLabels (key: "diagnosis code")
  diagnosed_by: "Diagnosed By", // Already under Event Detail Field Labels (key: "diagnosed by")
  referred_to: "Referred To", // Already under Event Detail Field Labels (key: "referred to")
  referred_by: "Referred By", // Already under Event Detail Field Labels (key: "referred by")
  therapy_type: "Therapy Type", // Already under Event Detail Field Labels (key: "therapy type")
  anesthesia_type: "Anesthesia Type", // Already under Event Detail Field Labels (key: "anesthesia type")
  ordered_by: "Ordered By", // Already under Event Detail Field Labels (key: "ordered by")
  admitting_physician: "Admitting Physician", // Already under Event Detail Field Labels (key: "admitting physician")
  expected_stay: "Expected Stay", // Already under Event Detail Field Labels (key: "expected stay")
  discharging_physician: "Discharging Physician", // Already under Event Detail Field Labels (key: "discharging physician")
  discharge_disposition: "Discharge Disposition", // Already under Event Detail Field Labels (key: "discharge disposition")
  follow_up: "Follow Up", // Already under Event Detail Field Labels (key: "follow up")
  // Field placeholders (similar to above, check against Event Detail Field Placeholders)
  medicationNamePlaceholder: "Enter medication name", // Differs from medication_namePlaceholder
  procedureNamePlaceholder: "Enter procedure name", // Differs from procedure_namePlaceholder
  performedByPlaceholder: "Who performed the procedure", // Differs from performed_byPlaceholder
  testNamePlaceholder: "Name of the test", // Differs from test_namePlaceholder
  referenceRangePlaceholder: "Normal range for test", // Differs from reference_rangePlaceholder
  diagnosisNamePlaceholder: "Enter diagnosis", // Differs from diagnosis_namePlaceholder
  diagnosisCodePlaceholder: "ICD or other code", // Differs from diagnosis_codePlaceholder
  diagnosedByPlaceholder: "Doctor who diagnosed", // Differs from diagnosed_byPlaceholder
  referredToPlaceholder: "Doctor/specialist referred to", // Differs from referred_toPlaceholder
  referredByPlaceholder: "Who made the referral", // Differs from referred_byPlaceholder
  therapyTypePlaceholder: "Type of therapy", // Differs from therapy_typePlaceholder
  orderedByPlaceholder: "Who ordered the test", // Differs from ordered_byPlaceholder
  admittingPhysicianPlaceholder: "Doctor who admitted patient", // Differs from admitting_physicianPlaceholder
  expectedStayPlaceholder: "Expected length of stay", // Differs from expected_stayPlaceholder
  dischargingPhysicianPlaceholder: "Doctor who discharged patient", // Differs from discharging_physicianPlaceholder
  followUpPlaceholder: "Follow-up instructions", // Differs from follow_upPlaceholder
  deleted: "Deleted", // General status or indicator
  // 'followUp' appears again, value "Follow Up" is same as 'follow_up'
  addressName: "Address", // Generic address label

  // --- Patient Edit Page ---
  patientDataNotLoaded: "Patient data not loaded",
  pleaseCheckForm: "Please check the form for errors", // Generic form error
  personalInfoUpdated: "Personal information updated successfully",
  failedToUpdatePersonalInfo: "Failed to update personal information",
  failedToUpdatePatientStatus: "Failed to update patient status",
  patientDataUpdated: "Patient data updated successfully", // General success
  patientDataUpdatedStatusFailed:
    "Patient data updated but status update failed", // Partial success
  failedToUpdatePatient: "Failed to update patient data", // General failure
  errorUpdatingPatient: "An error occurred while updating patient data", // Error
  loadingPatientData: "Loading Patient Data...", // Specific loading message
  pleaseWaitWhileWeRetrievePatient:
    "Please wait while we retrieve the patient information", // Loading subtext
  errorLoadingPatient: "Error Loading Patient", // Error title
  patientNotFoundDescription:
    "Patient not found. The ID might be invalid or the patient record may have been deleted.", // Error description for not found
  patientUpdatedSuccessfully: "Patient Updated Successfully", // Success title/message
  patientInfoUpdatedText:
    "The patient information has been updated and saved to the system.", // Success subtext
  firstName: "First Name",
  firstNameRequired: "First name is required",
  lastName: "Last Name",
  lastNameRequired: "Last name is required",
  selectDateOfBirth: "Select date of birth",
  selectGender: "Select gender",
  male: "Male",
  female: "Female",
  personalInfo: "Personal Info", // Short section title
  emailName: "Email", // Alternative for "Email Address" or "Email Label"

  // --- Template Selection (Patient Creation/Edit Flow) ---
  selectPatientTemplate: "Select Patient Template", // Modal/Page title
  chooseTemplateDescription: "Choose a template to use for this patient record", // Description
  errorLoadingTemplates: "Error Loading Templates", // Error title
  failedToLoadTemplates: "Failed to load templates. Please try again.", // Error message

  noTemplatesAvailable: "No Templates Available", // Empty state title (different from noTemplatesFound)
  noTemplatesFoundDescription:
    "No patient templates found. Please create a template first or contact your administrator.", // Empty state description
  continueToPatientInfo: "Continue to Patient Info", // Button

  // --- Patient Form (General, during creation/editing) ---
  // 'patientPersonalInformation' used as 'patientInformation' for tab label
  // 'patientPersonalInformation': "Patient Personal Information", Page/section title
  contactName: "Contact Name", // Generic contact name field

  enterPatientInformation: "Enter Patient Information", // Step title or header
  completeTemplate: "Complete {{name}} Template", // Step title with template name
  completePatientDetails: "Complete Patient Details", // Step title
  newPatientRegistration: "New Patient Registration", // Page title

  // --- Search & General Feedback (Misc) ---
  searching: "Searching...",
  searchResults: "Search Results",
  lastUpdate: "Last Update", // Meta info
  viewPatient: "View Patient", // Action
  noResultsFound: "No results found", // Generic search empty state

  // missed translations
  viewReports: "View Reports",
  passwordReset: "Password Reset",
  password: "Password",
  patientPersonalInformation: "Patient Personal Information",
  errorSavingReport: "Error Saving Report",
  errorOccurred: "Error Occurred",
  backToHome: "Back to Home",
  for: "For",
};

export default en;
export type EnglishTranslations = typeof en;
