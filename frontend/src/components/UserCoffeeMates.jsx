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
        <div className="my-profile-coffee-mates">
            <Accordion className="accordion-main-profile">
                <AccordionSummary
                    className="accordion-summary-profile"
                    expandIcon={<ArrowDownwardIcon />}
                    aria-controls="friends-content"
                    id="friends">
                    
                    <Typography>My Coffee Mates</Typography>
                </AccordionSummary>
        
                <AccordionDetails className="accordion-details-profile">
        
                    {unfilteredFriends.length > 1 && (
                        <>
                            <input
                                className="search-coffee-mates"
                                type="text"
                                placeholder="filter fellow coffee snobs"
                                value={coffeeMateQuery}
                                onChange={(e) => setCoffeeMateQuery(e.target.value)}
                            />

                            {filteredConfirmedFriends.length > 0 &&
                            filteredConfirmedFriends.map((friend, index) => (
                    
                                <a href={`/profile/${friend}`} key={index} className="search-coffee-mates-result">
                                    {friend}
                                </a>
                            ))}
                        </>
                    )}
                </AccordionDetails>
            </Accordion>
        </div>
    );
}