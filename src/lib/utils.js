module.exports = {
    date(timestamp) {
        const date = new Date(timestamp)
        const year = `000${date.getFullYear()}`.slice(-4)
        const month = `0${date.getMonth() + 1}`.slice(-2)
        const day = `0${date.getDate()}`.slice(-2)

        return {
            isoDate: `${year}-${month}-${day}`,
            year,
            month,
            day
        }
    }
}