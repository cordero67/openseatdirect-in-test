const PueroRicanDinnerTickets = props => {
  // sets ticket purchase data variable
  const [ticketPurchase, setTicketPurchase] = useState({
    eventID: puertoRicoEvent.eventID,
    eventName: puertoRicoEvent.eventName,
    ticketPrice: puertoRicoEvent.ticketPrice,
    ticketsSelected: 0,
    purchaseAmount: 0
  });

  // copies existing ticket order details from "localStorage"
  useEffect(() => {
    if (localStorage.getItem("order")) {
      const newOrder = JSON.parse(localStorage.getItem("order"));
      setTicketPurchase({
        ...ticketPurchase,
        eventID: newOrder.eventID,
        eventName: newOrder.eventName,
        ticketPrice: newOrder.ticketPrice,
        ticketsSelected: newOrder.ticketsSelected,
        purchaseAmount: newOrder.purchaseAmount
      });
    }
  }, []);

  // removes "order" from "localStorage"
  const cancelOrderHandler = () => {
    localStorage.removeItem("order");
  };

  // determines whether or not the "Checkout" button is enabled
  let validTicketAmount =
    ticketPurchase.ticketsSelected > 0 && ticketPurchase.ticketsSelected < 30;
  let checkoutButton = null;

  if (validTicketAmount) {
    checkoutButton = (
      <div style={{ color: "white" }}>
        <button onClick={purchaseTicketHandler} className={styles.ButtonWhite}>
          <Link to="/checkout">Checkout</Link>
        </button>
      </div>
    );
  } else {
    checkoutButton = (
      <div style={{ color: "white" }}>
        <button disabled={!validTicketAmount} className={styles.ButtonGrey}>
          Checkout
        </button>
      </div>
    );
  }

  let ticketSelection = null;

  // defines "ticketSelection" details
  ticketSelection = (
    <Aux>
      <div className={styles.GridMain}>
        <div className={styles.GridButtonsRight}>
          <button onClick={cancelOrderHandler} className={styles.ButtonWhite}>
            <a href="https://www.dahday.com/">Cancel</a>
          </button>
        </div>
      </div>
    </Aux>
  );

  return (
    <Aux>
      <div className={styles.ContentBoxLarge}>
        <div className={styles.SectionHeader}>{puertoRicoEvent.eventName}</div>
        <br></br>
        <div className={styles.Body}>{ticketSelection}</div>
      </div>
    </Aux>
  );
};

export default PueroRicanDinnerTickets;
