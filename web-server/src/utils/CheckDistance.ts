export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    console.log(lat1, lon1, lat2, lon2)
    // The math module contains a function
    // named toRadians which converts from
    // degrees to radians.
    lon1 =  lon1 * Math.PI / 180;
    lon2 = lon2 * Math.PI / 180;
    lat1 = lat1 * Math.PI / 180;
    lat2 = lat2 * Math.PI / 180;
    
    // Haversine formula
    let dlon = lon2 - lon1;
    let dlat = lat2 - lat1;
    let a = Math.pow(Math.sin(dlat / 2), 2)
    + Math.cos(lat1) * Math.cos(lat2)
    * Math.pow(Math.sin(dlon / 2),2);
    
    let c = 2 * Math.asin(Math.sqrt(a));
    // console.log(c)
    
    // Radius of earth in kilometers. Use 3956
    // for miles
    let r = 6371;
    
    // calculate the result
    return(c * r);
    }
    
    export const isNearby = (lat1: number, lon1: number, lat2: number, lon2: number, threshold:number) => {
            let distance = calculateDistance(lat1, lon1, lat2, lon2)
            console.log(distance)
            if(distance <= threshold){
                return true
            } else {
                return false
            }
        }