// const data = [{center: 12000}, {chairs: 500}];
// 2024-05-07T22:09:24.000Z
// const data = [{"center": "12000"}, {"chairs": "500"}]
const dataExtractor = (data) => {
    const keys = data.map(d => {
        for (k in d)
        {
            return k
        }
    });
    const values = data.map(d => {
        for(k of keys)
        {
            if(d[k])
            {
                return d[k];
            }
        }
    })
    
    return {keys, values};
}

// console.log(dataExtractor(data));

module.exports = dataExtractor