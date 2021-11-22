// find the pythagorean triples

// 5^2 + 12^2 = 13^2. Find this triples
// [0, 1, 3, 5, 7, 10, 12, 13, 20, 25]
// [0, 1, 9, 25 .. 144 ... 159 ...]
// for [0 - 25] {
    
// }



func printPythos(nums []int) {
    var a int
    var b int
    var c int

    square := make([]int, len(nums))
    m := make(map[int]struct{}{})

    for idx, num := nums {
        m[idx] = struct{}{}
    }

    for idx1, num1 := nums {
        for idx2, num2 := nums {
            pyth := square[idx1] + square[idx2]
			// add another for loop here. use map for unique array elements and binary search for duplicate elements
			// for unique, 
        }
    }


    fmt.Println(a, b, c)
}