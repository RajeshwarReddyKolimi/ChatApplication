export const formatDate = (time) => {
    const date = new Date(time);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    let hours = date.getHours();
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedDate = `${day} ${month}, ${hours}:${minutes} ${ampm}`;

    return formattedDate;
};
