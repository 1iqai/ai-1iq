import { Bot, CalendarCheck, ChartLine, Cog, Command, FolderClosed, FolderOpen, MessageCircleWarning, SquareKanban } from "lucide-react"

export const MENU = [

    {
        header: "Command Center",
        icon: Command,
        components: [
            {
                title: "1iQ Core",
                icon: ChartLine,
                component: "core"
            },
            {
                title: "1iQ AI Chat",
                icon: Bot,
                component: "chat",
            }
        ]
    },
    {
        header: "Project Management",
        icon: SquareKanban,
        components: [
            {
                title: "Mission Control",
                icon: Cog,
                component: "controlpanel"
            },
            {
                title: "1iQ Approvals",
                icon: CalendarCheck,
                component: "approvals",
            },
            {
                title: "Field",
                icon: SquareKanban,
                component: "field"
            },
            {
                title: "Intell",
                icon: Bot,
                component: "intel"
            },
            {
                title: "Gantt",
                icon: ChartLine,
                component: "gantt"
            }
        ]
    },
    {
        header: "Reporting",
        icon: MessageCircleWarning,
        components: [
            {
                title: "Reporting",
                icon: MessageCircleWarning,
                component: "reporting",
            },
        ]
    },
    {
        header: "File Management",
        icon: FolderClosed,
        components: [
            {
                title: "Archive Projects",
                icon: FolderOpen,
                component: "archived"
            }
        ]
    },
]