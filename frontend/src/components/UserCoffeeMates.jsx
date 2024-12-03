import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

export default function UserCoffeeMates({
  unfilteredFriends,
  filteredConfirmedFriends,
  coffeeMateQuery,
  setCoffeeMateQuery
}) {
  return (
    <div>
    <Accordion
    style={{
      display: "flex",
      flexDirection: "column",
    }}
    >
    <AccordionSummary
    expandIcon={<ArrowDownwardIcon />}
    aria-controls="panel1-content"
    id="panel1-header"
    >
    <Typography>Coffee Mates</Typography>
    </AccordionSummary>
    {unfilteredFriends.length > 1 && (
      <input
      type="text"
      placeholder="filter fellow coffee snobs"
      value={coffeeMateQuery}
      onChange={(e) => setCoffeeMateQuery(e.target.value)}
      style={{
        padding: "10px",
        fontSize: "16px",
        width: "80%",
        maxWidth: "400px",
        marginBottom: "20px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        justifySelf: "start",
      }}
      />
    )}
    <AccordionDetails
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "start",
      gap: "10px",
    }}
    >
    {filteredConfirmedFriends.length > 0 &&
      filteredConfirmedFriends.map((friend, index) => (
        <a href={`/profile/${friend}`} key={index}>
        {friend}
        </a>
      ))}
      </AccordionDetails>
      </Accordion>
      </div>
    );
  }