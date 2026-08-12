import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItemButton,
  ListItemIcon,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate, useLocation } from "react-router-dom";
import { Icons } from "@/components/icons/icons";

type Props = {
  children: React.ReactNode;
};

const ACCENT = "#0e7490"; // cyan-700, matches the active-state accent used in RootLayout's icon sidebar
const ACCENT_SOFT = "#ecfeff"; // cyan-50
const ACCENT_TINT = "#cffafe"; // cyan-100

const NAV_GROUPS = [
  {
    key: "master-rates",
    label: "Master Rates",
    icon: Icons.rate,
    items: [
      { label: "New Rates", path: "/master/master-rates", icon: Icons.playlistAdd },
      { label: "Rates List", path: "/master/master-rates/list", icon: Icons.bulletList },
    ],
  },
  {
    key: "category",
    label: "Category",
    icon: Icons.category,
    items: [
      { label: "Add Rate", path: "/billing/category-rate", icon: Icons.playlistAdd },
      { label: "List", path: "/billing/category-list", icon: Icons.bulletList },
    ],
  },
  {
    key: "wastage",
    label: "Wastage",
    icon: Icons.percent,
    items: [
      { label: "Add Wastage", path: "/billing/wastage", icon: Icons.playlistAdd },
      { label: "List", path: "/billing/wastage-list", icon: Icons.bulletList },
    ],
  },
];

const BillingLayout: React.FC<Props> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;
  const groupContainsActive = (items: { path: string }[]) => items.some((item) => isActive(item.path));

  const [expanded, setExpanded] = React.useState<string | false>(
    NAV_GROUPS.find((group) => groupContainsActive(group.items))?.key ?? NAV_GROUPS[0].key,
  );

  const handleChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div className="flex w-full h-[calc(100vh-70px)] gap-3">
      <div className="min-w-[260px] max-w-[260px] flex flex-col bg-white border rounded-lg overflow-hidden">
        <div className="h-[54px] flex items-center px-[16px] shrink-0 border-b border-slate-200">
          <Typography fontWeight={700} variant="h2" fontSize={19} sx={{ color: "#0f172a" }}>
            Master Billing
          </Typography>
        </div>
        <div className="flex-1 overflow-y-auto py-2 px-2 bg-slate-50">
          {NAV_GROUPS.map((group) => {
            const GroupIcon = group.icon;
            const groupActive = groupContainsActive(group.items);
            return (
              <Accordion
                key={group.key}
                expanded={expanded === group.key}
                onChange={handleChange(group.key)}
                disableGutters
                elevation={0}
                square
                sx={{
                  "&:before": { display: "none" },
                  border: "1px solid",
                  borderColor: "#e2e8f0",
                  borderRadius: "10px !important",
                  overflow: "hidden",
                  mb: 1,
                  bgcolor: "#ffffff",
                  boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)",
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon fontSize="small" sx={{ color: groupActive ? ACCENT : "#64748b" }} />}
                  sx={{
                    minHeight: 46,
                    px: 1.5,
                    bgcolor: groupActive ? ACCENT_SOFT : "#ffffff",
                    borderBottom: expanded === group.key ? "1px solid #e2e8f0" : "none",
                    "&:hover": { bgcolor: groupActive ? ACCENT_TINT : "#f1f5f9" },
                    "& .MuiAccordionSummary-content": { alignItems: "center", gap: 1, my: "10px" },
                  }}
                >
                  <GroupIcon fontSize="small" sx={{ color: groupActive ? ACCENT : "#475569" }} />
                  <Typography
                    fontSize={15.5}
                    fontWeight={600}
                    sx={{ color: groupActive ? ACCENT : "#1e293b" }}
                  >
                    {group.label}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 0, py: 0.5, bgcolor: "#ffffff" }}>
                  <List sx={{ py: 0 }}>
                    {group.items.map((item) => {
                      const ItemIcon = item.icon;
                      const active = isActive(item.path);
                      return (
                        <ListItemButton
                          key={item.path}
                          onClick={() => navigate(item.path)}
                          sx={{
                            mx: 1,
                            my: 0.4,
                            borderRadius: "8px",
                            borderLeft: active ? `3px solid ${ACCENT}` : "3px solid transparent",
                            bgcolor: active ? ACCENT_TINT : "transparent",
                            "&:hover": {
                              bgcolor: active ? ACCENT_TINT : "#f1f5f9",
                            },
                            "&.Mui-selected": {
                              bgcolor: ACCENT_TINT,
                              "&:hover": { bgcolor: ACCENT_TINT },
                            },
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <ItemIcon fontSize="small" sx={{ color: active ? ACCENT : "#64748b" }} />
                          </ListItemIcon>
                          <Typography
                            fontSize={14.5}
                            fontWeight={active ? 700 : 500}
                            sx={{ color: active ? ACCENT : "#334155" }}
                          >
                            {item.label}
                          </Typography>
                        </ListItemButton>
                      );
                    })}
                  </List>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </div>
      </div>
      <div className="w-full h-full p-0 border rounded-md bg-white overflow-hidden">{children}</div>
    </div>
  );
};

export default BillingLayout;
