const SAMPLE_DATA_CONTACTS = [
  {
    id: 1,
    color: "#9327FF",
    name: "Max Mustermann",
    email: "max.mustermann@test",
    phone: 0123456789,
    initials: "MM",
  },
  {
    id: 2,
    color: "#29ABE2",
    name: "Erika Musterfrau",
    email: "erika.musterfrau@test",
    phone: 0123456788,
    initials: "EM",
  },
  {
    id: 3,
    color: "#02CF2F",
    name: "John Doe",
    email: "john.doe@test",
    phone: 0123456799,
    initials: "JD",
  },
  {
    id: 4,
    color: "#AF1616",
    name: "Johny Depp",
    email: "johny.depp@test",
    phone: 0123456777,
    initials: "JD",
  },
  {
    id: 5,
    color: "#462F8A",
    name: "Laura Residenz",
    email: "laura.residenz@test",
    phone: 0123456766,
    initials: "LR",
  },
  {
    id: 6,
    color: "#FFC700",
    name: "Hannah Müller",
    email: "hannah.mueller@test",
    phone: 01234566789,
    initials: "HM",
  },
];

const SAMPLE_DATA_CATEGORYS = [
  {
    name: "Developing",
    color: "blue",
  },
  {
    name: "HR",
    color: "red",
  },
  {
    name: "Marketing",
    color: "orange",
  },
  {
    name: "Sales",
    color: "green",
  },
];

const SAMPLE_DATA_TASKS = [
  {
    title: "Develop new feature",
    description: "Implement a new feature in the software",
    category: "Developing",
    contacts: [1, 3, 4, 5],
    dueDate: "2023-07-05",
    priority: "medium",
    subtasks: [
      {
        name: "Write code for the feature",
        status: "checked",
      },
      {
        name: "Test the feature for bugs",
        status: "unchecked",
      },
    ],
    processStep: "inProgress",
  },
  {
    title: "Conduct performance review",
    description: "Schedule and conduct performance reviews for employees",
    category: "HR",
    contacts: [2, 4],
    dueDate: "2023-07-07",
    priority: "urgent",
    subtasks: [
      {
        name: "Prepare evaluation forms",
        status: "checked",
      },
      {
        name: "Schedule meetings with employees",
        status: "checked",
      },
    ],
    processStep: "done",
  },
  {
    title: "Launch new marketing campaign",
    description: "Plan and execute a new marketing campaign",
    category: "Marketing",
    contacts: [5],
    dueDate: "2023-07-10",
    priority: "medium",
    subtasks: [
      {
        name: "Create campaign strategy",
        status: "unchecked",
      },
      {
        name: "Design marketing materials",
        status: "unchecked",
      },
    ],
    processStep: "todo",
  },
  {
    title: "Follow up with potential leads",
    description: "Contact potential leads and follow up on sales inquiries",
    category: "Sales",
    contacts: [6, 2, 3],
    dueDate: "2023-07-12",
    priority: "low",
    subtasks: [
      {
        name: "Send follow-up emails",
        status: "checked",
      },
      {
        name: "Make phone calls to leads",
        status: "unchecked",
      },
    ],
    processStep: "awaitingFeedback",
  },
  {
    title: "Organize training session",
    description: "Coordinate and plan a training session for employees",
    category: "HR",
    contacts: [1, 3],
    dueDate: "2023-07-15",
    priority: "medium",
    subtasks: [
      {
        name: "Choose training topics",
        status: "unchecked",
      },
      {
        name: "Arrange training logistics",
        status: "unchecked",
      },
    ],
    processStep: "todo",
  },
  {
    title: "Create sales presentation",
    description: "Develop a sales presentation for a client meeting",
    category: "Sales",
    contacts: [4, 5, 6],
    dueDate: "2023-07-20",
    priority: "urgent",
    subtasks: [
      {
        name: "Research client's needs",
        status: "checked",
      },
      {
        name: "Design presentation slides",
        status: "checked",
      },
    ],
    processStep: "done",
  },
];
