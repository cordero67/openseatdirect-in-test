export const loadTransactionInfo = (eventDetails, orderTotals, ticketInfo, email, name) => {
    let TransactionInfo = {
        eventTitle: eventDetails.eventTitle,
        eventType: eventDetails.eventType,
        venue: eventDetails.locationVenueName,
        address1: eventDetails.locationAddress1,
        address2: eventDetails.locationAddress2,
        city: eventDetails.locationCity,
        state: eventDetails.locationState,
        zipPostalCode: eventDetails.locationZipPostalCode,
        countryCode: eventDetails.locationCountryCode,
        locationNote: eventDetails.locationNote,
        webinarLink: eventDetails.webinarLink,
        onlineInformation: eventDetails.onlineInformation,
        tbaInformation: eventDetails.tbaInformation,
        startDateTime: eventDetails.startDateTime,
        endDateTime: eventDetails.endDateTime,
        timeZone: eventDetails.timeZone,
        email: email,
        name: name,
        numTickets: orderTotals.ticketsPurchased,
        fullAmount: orderTotals.fullPurchaseAmount,
        discount: orderTotals.discountAmount,
        totalAmount: orderTotals.finalPurchaseAmount,
        tickets: ticketInfo,
        organizerEmail: eventDetails.organizerEmail
    }

    return TransactionInfo
}