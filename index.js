import { iterate } from './iterate.js'

const targetFunction = (x1, x2, x3) =>
  3 * x1 ** 2 * x2 -
  3 * x1 * x2 ** 2 +
  4 * x1 ** 2 * x2 * x3 -
  5 * x1 * x3 ** 2

const initialPoint = [2, 1, 2]

const t = 1
const epsilon = 0.001
const alpha = 1
const gamma = 3
const beta = 0.5

console.log('The simplex after the kth iteration: ')
console.log(
  iterate(targetFunction, initialPoint, {
    t,
    epsilon,
    alpha,
    gamma,
    beta,
  })
)
