export function iterate(
  targetFunction,
  initialPoint,
  parameters
) {
  const { t, epsilon, alpha, beta, gamma } = parameters
  const n = initialPoint.length

  const d1 = (t / (n * 2 ** 0.5)) * ((n + 1) ** 0.5 + n - 1)
  const d2 = (t / (n * 2 ** 0.5)) * ((n + 1) ** 0.5 - 1)

  const D = createInitialSimplex(initialPoint, d1, d2)
  const sorted = [...D].sort(
    (a, b) => targetFunction(...a) - targetFunction(...b)
  )
  const [xMin, xMax] = [sorted[0], sorted.at(-1) ?? []]

  const xn2 = findMassCenter(n, D, xMax)

  const deviation = findDeviation(n, targetFunction, D, xn2)
  if (deviation <= epsilon) return xMin

  const xn3 = reflect(xn2, xMax, alpha)

  if (targetFunction(...xn3) <= targetFunction(...xMin)) {
    const xn4 = extend(xn2, xn3, gamma)

    if (targetFunction(...xn4) <= targetFunction(...xMin)) {
      D[D.indexOf(xMax)] = xn4
      return D
    }

    D[D.indexOf(xMax)] = xn3
    return D
  }

  if (targetFunction(...xn3) <= targetFunction(...xMax)) {
    const xn5 = contract(xn2, xMax, beta)
    D[D.indexOf(xMax)] = xn5
    return D
  }

  console.dir({
    xn2,
    xn3,
    xMax,
    xMin,
    deviation,
    D,
    sorted,
  })
  return shrink(D, xMin)
}

const createInitialSimplex = (initialPoint, d1, d2) => {
  const simplex = [[...initialPoint]]

  for (const i in initialPoint) {
    const newVector = Array(initialPoint.length).fill(
      d2 + initialPoint[i]
    )
    newVector[i] = d1 + initialPoint[i]
    simplex.push(newVector)
  }

  return simplex
}

const findMassCenter = (n, D, xMax) => {
  const sum = D.reduce(
    (sum, vector) => sum.map((el, i) => el + vector[i]),
    Array(xMax.length).fill(0)
  )

  return sum.map((el, i) => (1 / n) * (el - xMax[i]))
}

const findDeviation = (n, targetFunction, D, xn2) => {
  const xn2Val = targetFunction(...xn2)
  const sum = D.map((vector) =>
    targetFunction(...vector)
  ).reduce((sum, val) => sum + (val - xn2Val) ** 2, 0)

  return ((1 / (n + 1)) * sum) ** 0.5
}

const reflect = (xn2, xMax, alpha) =>
  xn2.map((el, i) => el + alpha * (el - xMax[i]))

const extend = (xn2, xn3, gamma) =>
  xn2.map((el, i) => el + gamma * (xn3[i] - el))

const contract = (xn2, xMax, beta) =>
  xn2.map((el, i) => el + beta * (xMax[i] - el))

const shrink = (simplex, xMin) => {
  return simplex.map((vector) =>
    vector.map((el, i) => xMin[i] + 0.5 * (el - xMin[i]))
  )
}
