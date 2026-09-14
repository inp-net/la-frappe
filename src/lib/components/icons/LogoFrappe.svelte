<script lang="ts">
    interface Props {
        fill?: string;
        size?: string;
    }

    let {
        fill = 'dark',
        size = '30px'
    }: Props = $props();
</script>

<svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_32_14)">
<path d="M51.5294 62.4651L52.0391 74.6047L33.6869 86.0465H60.2884V100H9.30999L5.64882 87.1163L34.2894 69.2558L5 54.1861L11.3491 41.7675L51.5294 62.4651Z" fill="#FF00B8"/>
<path d="M88.0484 27.8605V43.0233H95V56.9767H88.0484V72.1395H95V86.0465H88.0484V93.0233L81.0968 100H60.242V86.0465H74.1452V13.9535H20.8497V27.907H6.94647V6.97674L13.8981 0H81.0968L88.0484 6.97674V13.9535H95V27.8605H88.0484Z" fill={fill} />
</g>
<defs>
<clipPath id="clip0_32_14">
<rect width="90" height="100" fill="white" transform="translate(5)"/>
</clipPath>
</defs>
</svg>
